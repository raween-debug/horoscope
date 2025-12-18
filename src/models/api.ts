/**
 * API Response DTOs and Service Interfaces
 * These interfaces define the contract between the app and backend.
 * Currently implemented with mocks, ready for real API integration.
 */

import {
    StarSign,
    Vibe,
    TimeAvailable,
    Quest,
    DailyGuidance,
    JournalEntry,
    GoalTrack,
    CompatibilityProfile,
    RitualTemplate,
} from '../types';

// ============================================
// Request DTOs
// ============================================

export interface GetGuidanceRequest {
    sign: StarSign;
    date: string; // ISO date string YYYY-MM-DD
}

export interface GenerateQuestsRequest {
    userId?: string;
    timeAvailable: TimeAvailable;
    activeGoalIds?: string[];
    date: string;
}

export interface SaveJournalEntryRequest {
    date: string;
    tarotCard: string;
    tarotMeaning: string;
    prompts: { question: string; answer: string }[];
    mood: number;
}

export interface CreateGoalRequest {
    title: string;
    why: string;
    northStar: string;
    weeklyMilestone: string;
    dailyMicroStep: string;
    fallbackStep: string;
}

export interface GetCalendarEventsRequest {
    month: number; // 0-11
    year: number;
    sign?: StarSign;
}

export interface AddCompatibilityRequest {
    name: string;
    sign: StarSign;
    userSign: StarSign;
}

// ============================================
// Response DTOs
// ============================================

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface GuidanceResponse {
    guidance: DailyGuidance;
}

export interface QuestsResponse {
    quests: Quest[];
    generatedAt: string;
}

export interface JournalEntriesResponse {
    entries: JournalEntry[];
    total: number;
}

export interface TarotDrawResponse {
    card: {
        name: string;
        meaning: string;
        imageUrl?: string;
    };
}

export interface GoalsResponse {
    goals: GoalTrack[];
}

export interface CalendarEvent {
    id: string;
    date: string;
    title: string;
    type: 'Moon' | 'Goal' | 'User' | 'GoodDay';
    description?: string;
}

export interface CalendarEventsResponse {
    events: CalendarEvent[];
    moonPhases: {
        newMoon: string;
        fullMoon: string;
    };
}

export interface CompatibilityResponse {
    profile: CompatibilityProfile;
}

export interface RitualsResponse {
    rituals: RitualTemplate[];
}

// ============================================
// Service Interfaces
// ============================================

export interface IGuidanceService {
    getTodayGuidance(request: GetGuidanceRequest): Promise<ApiResponse<GuidanceResponse>>;
}

export interface IQuestService {
    generateDailyQuests(request: GenerateQuestsRequest): Promise<ApiResponse<QuestsResponse>>;
}

export interface IJournalService {
    drawTarotCard(): Promise<ApiResponse<TarotDrawResponse>>;
    saveEntry(request: SaveJournalEntryRequest): Promise<ApiResponse<{ id: string }>>;
    getEntries(month: number, year: number): Promise<ApiResponse<JournalEntriesResponse>>;
    getMonthlySummary(month: number, year: number): Promise<ApiResponse<{ summary: string }>>;
}

export interface IGoalService {
    createGoal(request: CreateGoalRequest): Promise<ApiResponse<GoalTrack>>;
    getGoals(): Promise<ApiResponse<GoalsResponse>>;
    updateGoalProgress(goalId: string, progress: number): Promise<ApiResponse<GoalTrack>>;
    pauseGoal(goalId: string): Promise<ApiResponse<void>>;
    resumeGoal(goalId: string): Promise<ApiResponse<void>>;
}

export interface ICalendarService {
    getEvents(request: GetCalendarEventsRequest): Promise<ApiResponse<CalendarEventsResponse>>;
    getGoodDaysFor(sign: StarSign, month: number, year: number): Promise<ApiResponse<{ dates: string[] }>>;
}

export interface ICompatibilityService {
    calculateCompatibility(request: AddCompatibilityRequest): Promise<ApiResponse<CompatibilityResponse>>;
    getSavedProfiles(): Promise<ApiResponse<{ profiles: CompatibilityProfile[] }>>;
}

export interface IRitualService {
    getRituals(type?: 'NewMoon' | 'FullMoon'): Promise<ApiResponse<RitualsResponse>>;
}
