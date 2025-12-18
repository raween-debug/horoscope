import { Router, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

const TAROT_CARDS = [
    { name: "The Fool", meaning: "New beginnings, innocence, spontaneity" },
    { name: "The Magician", meaning: "Manifestation, resourcefulness, power" },
    { name: "The High Priestess", meaning: "Intuition, sacred knowledge, mystery" },
    { name: "The Empress", meaning: "Femininity, beauty, nature, abundance" },
    { name: "The Emperor", meaning: "Authority, structure, control, fatherhood" },
    { name: "The Hierophant", meaning: "Tradition, conformity, morality, ethics" },
    { name: "The Lovers", meaning: "Love, harmony, relationships, choices" },
    { name: "The Chariot", meaning: "Control, willpower, success, determination" },
    { name: "Strength", meaning: "Courage, persuasion, influence, compassion" },
    { name: "The Hermit", meaning: "Soul-searching, introspection, inner guidance" },
    { name: "Wheel of Fortune", meaning: "Good luck, karma, cycles, destiny" },
    { name: "Justice", meaning: "Fairness, truth, cause and effect, law" },
    { name: "The Hanged Man", meaning: "Pause, surrender, letting go, new perspectives" },
    { name: "Death", meaning: "Endings, change, transformation, transition" },
    { name: "Temperance", meaning: "Balance, moderation, patience, purpose" },
    { name: "The Devil", meaning: "Shadow self, attachment, addiction, restriction" },
    { name: "The Tower", meaning: "Sudden change, upheaval, chaos, revelation" },
    { name: "The Star", meaning: "Hope, faith, purpose, renewal, spirituality" },
    { name: "The Moon", meaning: "Illusion, fear, anxiety, subconscious" },
    { name: "The Sun", meaning: "Positivity, fun, warmth, success, vitality" },
    { name: "Judgement", meaning: "Reflection, reckoning, awakening" },
    { name: "The World", meaning: "Completion, integration, accomplishment" },
];

// Draw a tarot card
router.get('/tarot/draw', authenticate, async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const randomIndex = Math.floor(Math.random() * TAROT_CARDS.length);
        const card = TAROT_CARDS[randomIndex];

        res.json({
            success: true,
            data: { card },
        });
    } catch (error) {
        next(error);
    }
});

// Get journal entries
router.get('/entries', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { month, year } = req.query;

        let whereClause: any = { userId: req.userId! };

        if (month && year) {
            const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
            const endMonth = parseInt(month as string) === 12 ? 1 : parseInt(month as string) + 1;
            const endYear = parseInt(month as string) === 12 ? parseInt(year as string) + 1 : parseInt(year as string);
            const endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-01`;

            whereClause.date = {
                gte: startDate,
                lt: endDate,
            };
        }

        const entries = await prisma.journalEntry.findMany({
            where: whereClause,
            orderBy: { date: 'desc' },
        });

        const formattedEntries = entries.map(entry => ({
            ...entry,
            prompts: JSON.parse(entry.prompts),
        }));

        res.json({
            success: true,
            data: { entries: formattedEntries },
        });
    } catch (error) {
        next(error);
    }
});

// Create/Update journal entry
router.post('/entries', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { date, tarotCard, tarotMeaning, prompts, mood } = req.body;

        if (!date) {
            throw new AppError('Date is required', 400);
        }

        const entry = await prisma.journalEntry.upsert({
            where: {
                userId_date: {
                    userId: req.userId!,
                    date,
                },
            },
            update: {
                tarotCard: tarotCard || '',
                tarotMeaning: tarotMeaning || '',
                prompts: JSON.stringify(prompts || []),
                mood: mood || 3,
            },
            create: {
                userId: req.userId!,
                date,
                tarotCard: tarotCard || '',
                tarotMeaning: tarotMeaning || '',
                prompts: JSON.stringify(prompts || []),
                mood: mood || 3,
            },
        });

        res.json({
            success: true,
            data: {
                entry: {
                    ...entry,
                    prompts: JSON.parse(entry.prompts),
                },
            },
        });
    } catch (error) {
        next(error);
    }
});

// Get monthly summary
router.get('/summary', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            throw new AppError('Month and year are required', 400);
        }

        const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
        const endMonth = parseInt(month as string) === 12 ? 1 : parseInt(month as string) + 1;
        const endYear = parseInt(month as string) === 12 ? parseInt(year as string) + 1 : parseInt(year as string);
        const endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-01`;

        const entries = await prisma.journalEntry.findMany({
            where: {
                userId: req.userId!,
                date: { gte: startDate, lt: endDate },
            },
        });

        const totalEntries = entries.length;
        const averageMood = totalEntries > 0
            ? entries.reduce((sum, e) => sum + e.mood, 0) / totalEntries
            : 0;

        // Count tarot cards
        const cardCounts: Record<string, number> = {};
        entries.forEach(e => {
            if (e.tarotCard) {
                cardCounts[e.tarotCard] = (cardCounts[e.tarotCard] || 0) + 1;
            }
        });

        const mostCommonCard = Object.entries(cardCounts)
            .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

        res.json({
            success: true,
            data: {
                summary: {
                    totalEntries,
                    averageMood: Math.round(averageMood * 10) / 10,
                    mostCommonCard,
                    entriesPerWeek: Math.round((totalEntries / 4) * 10) / 10,
                },
            },
        });
    } catch (error) {
        next(error);
    }
});

export default router;
