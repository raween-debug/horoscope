import { Router, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Calculate moon phases (simplified)
const getMoonPhases = (year: number, month: number) => {
    // Simplified calculation - in production, use a proper astronomical library
    const baseNewMoon = new Date('2024-01-11'); // Known new moon
    const synodicMonth = 29.53059; // Days in lunar cycle

    const targetDate = new Date(year, month - 1, 15);
    const daysSinceBase = (targetDate.getTime() - baseNewMoon.getTime()) / (1000 * 60 * 60 * 24);
    const cyclesSince = daysSinceBase / synodicMonth;
    const currentCycleStart = new Date(baseNewMoon.getTime() + Math.floor(cyclesSince) * synodicMonth * 24 * 60 * 60 * 1000);

    const newMoonDate = new Date(currentCycleStart);
    const fullMoonDate = new Date(currentCycleStart.getTime() + (synodicMonth / 2) * 24 * 60 * 60 * 1000);

    return {
        newMoon: newMoonDate.toISOString().split('T')[0],
        fullMoon: fullMoonDate.toISOString().split('T')[0],
    };
};

// Get calendar events
router.get('/events', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { month, year } = req.query;

        const m = parseInt(month as string) || new Date().getMonth() + 1;
        const y = parseInt(year as string) || new Date().getFullYear();

        const moonPhases = getMoonPhases(y, m);

        // Get user's goals for milestones
        const goals = await prisma.goal.findMany({
            where: { userId: req.userId!, isPaused: false },
        });

        const events: any[] = [];

        // Add moon phase events
        if (moonPhases.newMoon.startsWith(`${y}-${String(m).padStart(2, '0')}`)) {
            events.push({
                id: `new-moon-${m}-${y}`,
                date: moonPhases.newMoon,
                title: 'New Moon',
                type: 'Moon',
                description: 'Perfect time for new beginnings and setting intentions',
            });
        }

        if (moonPhases.fullMoon.startsWith(`${y}-${String(m).padStart(2, '0')}`)) {
            events.push({
                id: `full-moon-${m}-${y}`,
                date: moonPhases.fullMoon,
                title: 'Full Moon',
                type: 'Moon',
                description: 'Time for reflection and releasing what no longer serves you',
            });
        }

        // Add goal milestone reminders (weekly on Mondays)
        for (let day = 1; day <= 31; day++) {
            const date = new Date(y, m - 1, day);
            if (date.getMonth() !== m - 1) break; // Exceeded month

            if (date.getDay() === 1 && goals.length > 0) { // Monday
                events.push({
                    id: `goal-check-${date.toISOString().split('T')[0]}`,
                    date: date.toISOString().split('T')[0],
                    title: 'Weekly Goal Check-in',
                    type: 'Goal',
                    description: `Review progress on ${goals.length} active goal(s)`,
                });
            }
        }

        // Get journal entries for mood tracking
        const startDate = `${y}-${String(m).padStart(2, '0')}-01`;
        const endMonth = m === 12 ? 1 : m + 1;
        const endYear = m === 12 ? y + 1 : y;
        const endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-01`;

        const journalEntries = await prisma.journalEntry.findMany({
            where: {
                userId: req.userId!,
                date: { gte: startDate, lt: endDate },
                mood: { gte: 4 }, // Good days
            },
        });

        journalEntries.forEach(entry => {
            events.push({
                id: `good-day-${entry.date}`,
                date: entry.date,
                title: 'Good Day',
                type: 'GoodDay',
                description: `Mood rating: ${entry.mood}/5`,
            });
        });

        res.json({
            success: true,
            data: {
                events: events.sort((a, b) => a.date.localeCompare(b.date)),
                moonPhases,
            },
        });
    } catch (error) {
        next(error);
    }
});

export default router;
