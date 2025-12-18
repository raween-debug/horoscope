import { Router, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const prisma = new PrismaClient();

interface QuestTemplate {
    title: string;
    type: 'Main' | 'Side' | 'Recovery';
    xp: number;
    estimatedMinutes: number;
    tinyVersion?: string;
}

const QUEST_TEMPLATES: QuestTemplate[] = [
    { title: "Complete your most important task", type: "Main", xp: 50, estimatedMinutes: 45, tinyVersion: "Work on it for 10 minutes" },
    { title: "Review and plan tomorrow", type: "Side", xp: 20, estimatedMinutes: 15, tinyVersion: "Write 3 priorities" },
    { title: "Take a mindful break", type: "Recovery", xp: 10, estimatedMinutes: 10, tinyVersion: "3 deep breaths" },
    { title: "Work on your main goal", type: "Main", xp: 50, estimatedMinutes: 30, tinyVersion: "Just start for 5 minutes" },
    { title: "Organize your workspace", type: "Side", xp: 20, estimatedMinutes: 20, tinyVersion: "Clear one surface" },
    { title: "Stretch or light exercise", type: "Recovery", xp: 10, estimatedMinutes: 10, tinyVersion: "5 stretches" },
    { title: "Learn something new", type: "Side", xp: 20, estimatedMinutes: 20, tinyVersion: "Read one article" },
    { title: "Connect with someone", type: "Recovery", xp: 10, estimatedMinutes: 15, tinyVersion: "Send one message" },
];

// Seeded random
const seededRandom = (seed: number): number => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

// Generate quests for a day
router.post('/generate', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { date, timeAvailable } = req.body;
        const dateStr = date || new Date().toISOString().split('T')[0];
        const userId = req.userId!;

        // Check for existing quests
        const existingQuests = await prisma.quest.findMany({
            where: { userId, date: dateStr },
        });

        if (existingQuests.length > 0) {
            return res.json({
                success: true,
                data: { quests: existingQuests, generatedAt: new Date().toISOString() },
            });
        }

        // Generate new quests
        const dateParts = dateStr.split('-').map(Number);
        const seed = dateParts[0] * 10000 + dateParts[1] * 100 + dateParts[2];

        const shuffled = [...QUEST_TEMPLATES].sort((a, b) =>
            seededRandom(seed + a.title.charCodeAt(0)) - seededRandom(seed + b.title.charCodeAt(0))
        );

        // Select one of each type
        const main = shuffled.find(q => q.type === 'Main')!;
        const side = shuffled.find(q => q.type === 'Side')!;
        const recovery = shuffled.find(q => q.type === 'Recovery')!;

        const questsToCreate = [main, side, recovery].map(template => ({
            id: uuidv4(),
            userId,
            title: template.title,
            type: template.type,
            xp: template.xp,
            estimatedMinutes: template.estimatedMinutes,
            tinyVersion: template.tinyVersion || null,
            isCompleted: false,
            date: dateStr,
        }));

        await prisma.quest.createMany({ data: questsToCreate });

        const quests = await prisma.quest.findMany({
            where: { userId, date: dateStr },
        });

        res.json({
            success: true,
            data: { quests, generatedAt: new Date().toISOString() },
        });
    } catch (error) {
        next(error);
    }
});

// Get quests for a date
router.get('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { date } = req.query;
        const dateStr = (date as string) || new Date().toISOString().split('T')[0];

        const quests = await prisma.quest.findMany({
            where: { userId: req.userId!, date: dateStr },
            orderBy: { createdAt: 'asc' },
        });

        res.json({
            success: true,
            data: { quests },
        });
    } catch (error) {
        next(error);
    }
});

// Complete a quest
router.post('/:id/complete', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const quest = await prisma.quest.findFirst({
            where: { id, userId: req.userId! },
        });

        if (!quest) {
            throw new AppError('Quest not found', 404);
        }

        const updatedQuest = await prisma.quest.update({
            where: { id },
            data: {
                isCompleted: !quest.isCompleted,
                completedAt: !quest.isCompleted ? new Date() : null,
            },
        });

        // Update pet XP if completing (not uncompleting)
        if (updatedQuest.isCompleted) {
            await prisma.pet.update({
                where: { userId: req.userId! },
                data: { xp: { increment: quest.xp } },
            });

            // Check for evolution
            const pet = await prisma.pet.findUnique({ where: { userId: req.userId! } });
            if (pet) {
                let newStage = pet.stage;
                if (pet.xp >= 500 && pet.stage !== 'Evolved') newStage = 'Evolved';
                else if (pet.xp >= 300 && pet.stage === 'Junior') newStage = 'Adult';
                else if (pet.xp >= 100 && pet.stage === 'Hatchling') newStage = 'Junior';
                else if (pet.xp >= 50 && pet.stage === 'Egg') newStage = 'Hatchling';

                if (newStage !== pet.stage) {
                    await prisma.pet.update({
                        where: { userId: req.userId! },
                        data: { stage: newStage },
                    });
                }
            }
        }

        res.json({
            success: true,
            data: { quest: updatedQuest },
        });
    } catch (error) {
        next(error);
    }
});

export default router;
