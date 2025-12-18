import { Quest, TimeAvailable } from '../types';
import { IQuestService, GenerateQuestsRequest, ApiResponse, QuestsResponse } from '../models/api';

// Quest templates by type
const MAIN_QUESTS = [
    { title: 'Complete your main project task', tinyVersion: 'Outline the next step (2 min)' },
    { title: 'Work on your biggest priority', tinyVersion: 'Write down what needs to happen next (2 min)' },
    { title: 'Make progress on your #1 goal', tinyVersion: 'Take one small action (2 min)' },
    { title: 'Tackle the thing you\'ve been avoiding', tinyVersion: 'Just start with 2 minutes' },
];

const SIDE_QUESTS = [
    { title: 'Quick tidy up' },
    { title: 'Reply to one important message' },
    { title: 'Review your calendar for tomorrow' },
    { title: 'Organize one small area' },
    { title: 'Clear your inbox' },
];

const RECOVERY_QUESTS = [
    { title: 'Deep breathing exercise' },
    { title: 'Take a short walk' },
    { title: 'Stretch for a few minutes' },
    { title: 'Listen to calming music' },
    { title: 'Drink a full glass of water' },
];

/**
 * Seeded random for deterministic quest generation
 */
const seededRandom = (seed: number): number => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

/**
 * Generate daily quests - MOCK IMPLEMENTATION
 * Will be replaced with API call: POST /api/quests/generate
 *
 * Stardust Rules (XP rewards):
 * - Main Quest: 50 XP (highest priority, biggest impact)
 * - Side Quest: 20 XP (supporting tasks)
 * - Recovery Quest: 10 XP (self-care, always achievable)
 */
export const generateDailyQuests = (timeAvailable: TimeAvailable, dateOverride?: string): Quest[] => {
    const today = dateOverride ? new Date(dateOverride) : new Date();
    const dateStr = today.toISOString().split('T')[0];

    // Create deterministic seed from date
    const dateParts = dateStr.split('-').map(Number);
    const seed = dateParts[0] * 10000 + dateParts[1] * 100 + dateParts[2];

    // Select quests based on seed
    const mainIndex = Math.floor(seededRandom(seed) * MAIN_QUESTS.length);
    const sideIndex = Math.floor(seededRandom(seed + 1) * SIDE_QUESTS.length);
    const recoveryIndex = Math.floor(seededRandom(seed + 2) * RECOVERY_QUESTS.length);

    const mainQuest = MAIN_QUESTS[mainIndex];
    const sideQuest = SIDE_QUESTS[sideIndex];
    const recoveryQuest = RECOVERY_QUESTS[recoveryIndex];

    // Scale main quest time based on availability
    const mainTime = timeAvailable >= 20 ? 20 : timeAvailable >= 10 ? 10 : 5;

    return [
        {
            id: `main-${dateStr}`,
            title: mainQuest.title,
            type: 'Main',
            estimatedMinutes: mainTime,
            isCompleted: false,
            tinyVersion: mainQuest.tinyVersion,
        },
        {
            id: `side-${dateStr}`,
            title: sideQuest.title,
            type: 'Side',
            estimatedMinutes: 5,
            isCompleted: false,
        },
        {
            id: `recovery-${dateStr}`,
            title: recoveryQuest.title,
            type: 'Recovery',
            estimatedMinutes: 2,
            isCompleted: false,
        },
    ];
};

/**
 * Service class implementation (for future API integration)
 */
export class QuestService implements IQuestService {
    async generateDailyQuests(request: GenerateQuestsRequest): Promise<ApiResponse<QuestsResponse>> {
        try {
            // MOCK: In production, this would be:
            // const response = await fetch('/api/quests/generate', {
            //     method: 'POST',
            //     body: JSON.stringify(request),
            // });
            // return await response.json();

            const quests = generateDailyQuests(request.timeAvailable, request.date);
            return {
                success: true,
                data: {
                    quests,
                    generatedAt: new Date().toISOString(),
                },
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to generate quests',
            };
        }
    }
}
