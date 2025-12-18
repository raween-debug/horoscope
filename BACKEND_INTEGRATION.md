# Backend Integration Notes

This document describes how to swap the current mock implementations with real API calls.

## Overview

All services are currently implemented as mocks in `/src/services/`. Each service follows a common pattern:
1. A simple function for synchronous mock data (used directly in components)
2. A service class implementing the interface defined in `/src/models/api.ts`

## Service Interfaces & DTOs

All types are defined in `/src/models/api.ts`. Key interfaces:

```typescript
// Standard API response wrapper
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
```

## Services to Replace

### 1. Guidance Service

**File:** `src/services/guidanceService.ts`

**Current Mock:** Returns deterministic guidance based on date seed

**API Endpoint:**
```
GET /api/guidance?sign={sign}&date={date}
```

**Request:**
```typescript
interface GetGuidanceRequest {
    sign: StarSign;
    date: string; // YYYY-MM-DD
}
```

**Response:**
```typescript
interface GuidanceResponse {
    guidance: {
        date: string;
        starGuidance: string;
        theme: string;
        mode: 'Focus' | 'Social' | 'Reset';
        do: string[];
        avoid: string[];
        timingHint: 'Morning' | 'Afternoon' | 'Evening';
    }
}
```

**Integration Steps:**
1. Import `GuidanceService` class
2. Replace direct `getTodayGuidance()` calls with `service.getTodayGuidance(request)`
3. Handle loading/error states in UI

---

### 2. Quest Service

**File:** `src/services/questService.ts`

**Current Mock:** Returns 3 seeded quests based on date

**API Endpoint:**
```
POST /api/quests/generate
```

**Request:**
```typescript
interface GenerateQuestsRequest {
    userId?: string;
    timeAvailable: 5 | 10 | 20 | 45;
    activeGoalIds?: string[];
    date: string;
}
```

**Response:**
```typescript
interface QuestsResponse {
    quests: Quest[];
    generatedAt: string;
}
```

**XP Rules (Stardust System):**
- Main Quest: 50 XP
- Side Quest: 20 XP
- Recovery Quest: 10 XP

---

### 3. Journal Service

**File:** `src/services/journalService.ts`

**Current Mock:** Random tarot draw, console.log for saves

**API Endpoints:**
```
GET  /api/tarot/draw
POST /api/journal/entries
GET  /api/journal/entries?month={month}&year={year}
GET  /api/journal/summary?month={month}&year={year}
```

**Tarot Response:**
```typescript
interface TarotDrawResponse {
    card: {
        name: string;
        meaning: string;
        imageUrl?: string;
    }
}
```

**Journal Entry Request:**
```typescript
interface SaveJournalEntryRequest {
    date: string;
    tarotCard: string;
    tarotMeaning: string;
    prompts: { question: string; answer: string }[];
    mood: number; // 1-5
}
```

---

### 4. Calendar Service

**File:** `src/services/calendarService.ts`

**Current Mock:** Static events for full moon and goal milestone

**API Endpoint:**
```
GET /api/calendar/events?month={month}&year={year}&sign={sign}
```

**Response:**
```typescript
interface CalendarEventsResponse {
    events: {
        id: string;
        date: string;
        title: string;
        type: 'Moon' | 'Goal' | 'User' | 'GoodDay';
        description?: string;
    }[];
    moonPhases: {
        newMoon: string;
        fullMoon: string;
    }
}
```

---

### 5. Goal Service (Not Yet Implemented)

**API Endpoints:**
```
POST   /api/goals           - Create goal
GET    /api/goals           - Get all goals
PATCH  /api/goals/{id}      - Update progress
POST   /api/goals/{id}/pause
POST   /api/goals/{id}/resume
```

**Create Goal Request:**
```typescript
interface CreateGoalRequest {
    title: string;
    why: string;
    northStar: string;        // 30-60 day goal
    weeklyMilestone: string;
    dailyMicroStep: string;
    fallbackStep: string;
}
```

---

### 6. Compatibility Service (Not Yet Implemented)

**API Endpoint:**
```
POST /api/compatibility/calculate
GET  /api/compatibility/profiles
```

**Request:**
```typescript
interface AddCompatibilityRequest {
    name: string;
    sign: StarSign;
    userSign: StarSign;
}
```

**Response:**
```typescript
interface CompatibilityResponse {
    profile: {
        id: string;
        name: string;
        sign: StarSign;
        vibeScore: number;    // 0-100
        strengths: string[];
        frictionTrigger: string;
        advice: string;
    }
}
```

---

## Authentication Strategy (Future)

Placeholder for auth integration:

```typescript
// Suggested approach
interface AuthState {
    token: string | null;
    userId: string | null;
    isAuthenticated: boolean;
}

// API client with auth header
const apiClient = {
    async fetch<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
        const token = getAuthToken(); // From secure storage
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
                ...options?.headers,
            },
        });
        return response.json();
    }
};
```

**Auth Endpoints to Implement:**
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me
```

---

## State Sync Strategy

Current state is local-only via Zustand + AsyncStorage.

**Sync Approach:**
1. **Optimistic Updates:** Update local state immediately, sync to server in background
2. **Conflict Resolution:** Server wins, with local queue for offline changes
3. **Delta Sync:** Only sync changed fields, not entire state

**Key Sync Points:**
- Quest completion → POST /api/quests/{id}/complete
- Task changes → POST /api/tasks/sync
- Pet XP/Stage → Derived server-side from quest completions
- Journal entries → POST on save, GET on app launch

---

## Migration Checklist

- [ ] Set up API client with base URL configuration
- [ ] Add auth token management (SecureStore)
- [ ] Replace `getTodayGuidance` with API call
- [ ] Replace `generateDailyQuests` with API call
- [ ] Implement journal entry persistence
- [ ] Implement goal CRUD operations
- [ ] Add offline queue for failed requests
- [ ] Add loading states to all async operations
- [ ] Add error handling with retry logic
- [ ] Implement push notifications for reminders
- [ ] Add analytics tracking

---

## Environment Configuration

```typescript
// src/config/env.ts
export const config = {
    API_BASE_URL: __DEV__
        ? 'http://localhost:3000/api'
        : 'https://api.cosmicquest.app',
    API_TIMEOUT: 10000,
    STORAGE_VERSION: 1,
};
```
