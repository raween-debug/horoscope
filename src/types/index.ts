export type StarSign =
    | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer'
    | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio'
    | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces'
    | 'NotSure';

export type Vibe = 'Organized' | 'Focused' | 'Calm' | 'Strong' | 'SchoolWork' | 'Confidence';

export type TimeAvailable = 5 | 10 | 20 | 45;

export type ReminderSetting = 'Off' | 'Morning' | 'Evening';

export interface UserProfile {
    name: string;
    vibe: Vibe;
    sign: StarSign;
    timeAvailable: TimeAvailable;
    reminder: ReminderSetting;
    hasOnboarded: boolean;
}

export interface StarProfile {
    sign: StarSign;
    element: 'Fire' | 'Earth' | 'Air' | 'Water';
    rulingPlanet: string;
    traits: string[];
}

export interface DailyGuidance {
    date: string;
    starGuidance: string;
    theme: string;
    mode: 'Focus' | 'Social' | 'Reset';
    do: string[];
    avoid: string[];
    timingHint: 'Morning' | 'Afternoon' | 'Evening';
}

export type QuestType = 'Main' | 'Side' | 'Recovery';

export interface Quest {
    id: string;
    title: string;
    type: QuestType;
    estimatedMinutes: number;
    isCompleted: boolean;
    tinyVersion?: string; // Fallback 2 min version
}

export interface Task {
    id: string;
    title: string;
    isCompleted: boolean;
    isTop3: boolean;
}

export interface GoalTrack {
    id: string;
    title: string;
    why: string;
    northStar: string; // 30-60 day goal
    weeklyMilestone: string;
    dailyMicroStep: string;
    fallbackStep: string;
    isActive: boolean;
    progress: number; // 0-100
}

export type PetStage = 'Egg' | 'Hatchling' | 'Junior' | 'Adult' | 'Evolved';

export interface PetState {
    name: string;
    stage: PetStage;
    xp: number;
    streak: number;
    lastInteractionDate: string;
}

export interface JournalEntry {
    id: string;
    date: string;
    tarotCard: string;
    tarotMeaning: string;
    prompts: { question: string; answer: string }[];
    mood: number; // 1-5 or similar
}

export interface RitualTemplate {
    id: string;
    title: string;
    type: 'NewMoon' | 'FullMoon';
    steps: string[];
}

export interface CompatibilityProfile {
    id: string;
    name: string;
    sign: StarSign;
    vibeScore: number; // 0-100
    strengths: string[];
    frictionTrigger: string;
    advice: string;
}
