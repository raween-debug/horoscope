import { StarSign } from '../types';

export interface CalendarEvent {
    date: string;
    title: string;
    type: 'Moon' | 'Goal' | 'User';
}

export const getCalendarEvents = (month: number, year: number): CalendarEvent[] => {
    // Mock events
    return [
        {
            date: `${year}-${String(month + 1).padStart(2, '0')}-15`,
            title: 'Full Moon',
            type: 'Moon',
        },
        {
            date: `${year}-${String(month + 1).padStart(2, '0')}-20`,
            title: 'Goal Milestone',
            type: 'Goal',
        },
    ];
};
