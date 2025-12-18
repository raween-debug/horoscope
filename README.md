# Cosmic Quest

A horoscope-guided organizer and goal coach app built with React Native (Expo).

## Features

- **Onboarding**: Personalized setup for vibe, star sign, and time availability.
- **Today Dashboard**: Daily star guidance, quests, and tasks.
- **Companion**: A zodiac pet that grows as you complete goals (Egg -> Hatchling -> etc.).
- **Goals**: Track long-term goals and daily micro-steps.
- **Calendar**: Moon phases and upcoming events.
- **Journal**: Daily Tarot draw and reflection.

## Tech Stack

- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **State Management**: Zustand + AsyncStorage (Persistence)
- **UI**: Custom components with Lucide Icons

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the app:
   ```bash
   npx expo start
   ```

3. Run on device/emulator:
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Scan QR code with Expo Go app

## Backend Integration Points

The app currently uses mock services in `src/services/`. To connect a real backend:

- **Auth**: Replace `user` state in `useStore` with real auth token/user data.
- **Guidance**: Update `getTodayGuidance` in `guidanceService.ts` to fetch from API.
- **Quests**: Update `generateDailyQuests` in `questService.ts` to fetch/generate on server.
- **Journal**: Update `saveJournalEntry` in `journalService.ts` to post to API.
- **Sync**: Implement a sync mechanism in `useStore` or a separate sync service.

## Directory Structure

- `src/components`: Reusable UI components
- `src/navigation`: Navigator configurations
- `src/screens`: Screen components (Onboarding, Tabs, Settings)
- `src/services`: Mock business logic
- `src/store`: Zustand state store
- `src/theme`: Design tokens (colors, typography)
- `src/types`: TypeScript interfaces
