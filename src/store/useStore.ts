import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, Quest, PetState, GoalTrack, Task } from '../types';
import { generateDailyQuests } from '../services/questService';

// Schema version - increment when making breaking changes to state shape
const STORAGE_VERSION = 1;

// Helper to get today's date string in YYYY-MM-DD format
const getTodayDateString = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

// Helper to check if two date strings are consecutive days
const areConsecutiveDays = (dateStr1: string, dateStr2: string): boolean => {
    const date1 = new Date(dateStr1);
    const date2 = new Date(dateStr2);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
};

// Helper to determine pet stage based on XP thresholds
const getPetStage = (xp: number, hasCompletedFirstMainQuest: boolean): PetState['stage'] => {
    if (!hasCompletedFirstMainQuest) return 'Egg';
    if (xp >= 1000) return 'Evolved';
    if (xp >= 500) return 'Adult';
    if (xp >= 200) return 'Junior';
    return 'Hatchling';
};

interface AppState {
    user: UserProfile | null;
    quests: Quest[];
    tasks: Task[];
    pet: PetState;
    goals: GoalTrack[];
    lastQuestDate: string | null;

    setUser: (user: UserProfile) => void;
    completeQuest: (id: string) => void;
    addTask: (title: string) => void;
    toggleTask: (id: string) => void;
    deleteTask: (id: string) => void;
    setTaskTop3: (id: string, isTop3: boolean) => void;
    refreshDailyQuests: (force?: boolean) => void;
    checkAndRefreshQuests: () => void;
    feedPet: () => void;
    reset: () => void;
}

const INITIAL_PET: PetState = {
    name: 'Companion',
    stage: 'Egg',
    xp: 0,
    streak: 0,
    lastInteractionDate: new Date().toISOString(),
};

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            user: null,
            quests: [],
            tasks: [],
            pet: INITIAL_PET,
            goals: [],
            lastQuestDate: null,

            setUser: (user) => set({ user }),

            completeQuest: (id) => {
                set((state) => {
                    const quest = state.quests.find((q) => q.id === id);
                    if (!quest || quest.isCompleted) return state;

                    // Award XP based on quest type (Stardust rules: Main > Side > Recovery)
                    let xpGain = 10; // Recovery
                    if (quest.type === 'Main') xpGain = 50;
                    if (quest.type === 'Side') xpGain = 20;

                    const newXp = state.pet.xp + xpGain;
                    const today = getTodayDateString();
                    const lastDate = state.pet.lastInteractionDate.split('T')[0];

                    // Calculate new streak
                    let newStreak = state.pet.streak;
                    if (lastDate !== today) {
                        // First interaction today
                        if (areConsecutiveDays(lastDate, today)) {
                            newStreak = state.pet.streak + 1;
                        } else if (lastDate !== today) {
                            // Streak broken (more than 1 day gap)
                            newStreak = 1;
                        }
                    }

                    // Check if this is the first main quest completion (for hatching)
                    const isFirstMainQuest = quest.type === 'Main' && state.pet.stage === 'Egg';
                    const newStage = getPetStage(newXp, isFirstMainQuest || state.pet.stage !== 'Egg');

                    return {
                        quests: state.quests.map((q) =>
                            q.id === id ? { ...q, isCompleted: true } : q
                        ),
                        pet: {
                            ...state.pet,
                            xp: newXp,
                            stage: newStage,
                            streak: newStreak,
                            lastInteractionDate: new Date().toISOString(),
                        }
                    };
                });
            },

            addTask: (title) => set((state) => ({
                tasks: [...state.tasks, { id: Date.now().toString(), title, isCompleted: false, isTop3: false }]
            })),

            toggleTask: (id) => set((state) => ({
                tasks: state.tasks.map((t) =>
                    t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
                )
            })),

            deleteTask: (id) => set((state) => ({
                tasks: state.tasks.filter((t) => t.id !== id)
            })),

            setTaskTop3: (id, isTop3) => set((state) => ({
                tasks: state.tasks.map((t) =>
                    t.id === id ? { ...t, isTop3 } : t
                )
            })),

            refreshDailyQuests: (force = false) => {
                const { user, lastQuestDate } = get();
                if (!user) return;

                const today = getTodayDateString();

                // Only refresh if it's a new day or forced
                if (!force && lastQuestDate === today) {
                    return;
                }

                const newQuests = generateDailyQuests(user.timeAvailable);
                set({ quests: newQuests, lastQuestDate: today });
            },

            checkAndRefreshQuests: () => {
                const { user, lastQuestDate, refreshDailyQuests } = get();
                if (!user) return;

                const today = getTodayDateString();

                // Auto-refresh if it's a new day
                if (lastQuestDate !== today) {
                    refreshDailyQuests(true);
                }
            },

            feedPet: () => {
                // Logic for feeding
                set((state) => ({
                    pet: { ...state.pet, xp: state.pet.xp + 5 }
                }));
            },

            reset: () => set({ user: null, quests: [], tasks: [], pet: INITIAL_PET, goals: [], lastQuestDate: null }),
        }),
        {
            name: 'cosmic-quest-storage',
            version: STORAGE_VERSION,
            storage: createJSONStorage(() => AsyncStorage),
            migrate: (persistedState: unknown, version: number) => {
                // Safe migration with fallback
                const state = persistedState as Partial<AppState> | null;

                if (!state) {
                    // No persisted state, return fresh state
                    return {
                        user: null,
                        quests: [],
                        tasks: [],
                        pet: INITIAL_PET,
                        goals: [],
                        lastQuestDate: null,
                    };
                }

                // Migration from version 0 (unversioned) to version 1
                if (version === 0 || version === undefined) {
                    return {
                        user: state.user ?? null,
                        quests: Array.isArray(state.quests) ? state.quests : [],
                        tasks: Array.isArray(state.tasks) ? state.tasks : [],
                        pet: state.pet && typeof state.pet === 'object' ? {
                            ...INITIAL_PET,
                            ...state.pet,
                        } : INITIAL_PET,
                        goals: Array.isArray(state.goals) ? state.goals : [],
                        lastQuestDate: state.lastQuestDate ?? null,
                    };
                }

                // Return state as-is for current version
                return state as AppState;
            },
            // Partial persistence - only persist essential data
            partialize: (state) => ({
                user: state.user,
                quests: state.quests,
                tasks: state.tasks,
                pet: state.pet,
                goals: state.goals,
                lastQuestDate: state.lastQuestDate,
            }),
        }
    )
);
