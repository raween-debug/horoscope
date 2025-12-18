import { Router, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Update user profile
router.patch('/profile', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { name, sign, timePreference } = req.body;

        const user = await prisma.user.update({
            where: { id: req.userId! },
            data: {
                ...(name !== undefined && { name }),
                ...(sign !== undefined && { sign }),
                ...(timePreference !== undefined && { timePreference }),
            },
            include: { pet: true },
        });

        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    sign: user.sign,
                    timePreference: user.timePreference,
                },
                pet: user.pet,
            },
        });
    } catch (error) {
        next(error);
    }
});

// Get pet info
router.get('/pet', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const pet = await prisma.pet.findUnique({
            where: { userId: req.userId! },
        });

        if (!pet) {
            throw new AppError('Pet not found', 404);
        }

        res.json({
            success: true,
            data: { pet },
        });
    } catch (error) {
        next(error);
    }
});

// Update pet name
router.patch('/pet', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;

        if (!name?.trim()) {
            throw new AppError('Name is required', 400);
        }

        const pet = await prisma.pet.update({
            where: { userId: req.userId! },
            data: { name: name.trim() },
        });

        res.json({
            success: true,
            data: { pet },
        });
    } catch (error) {
        next(error);
    }
});

// Feed pet (called after main quest completion)
router.post('/pet/feed', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const pet = await prisma.pet.findUnique({
            where: { userId: req.userId! },
        });

        if (!pet) {
            throw new AppError('Pet not found', 404);
        }

        // Check if already fed today
        const today = new Date().toISOString().split('T')[0];
        const lastFed = pet.lastFed?.toISOString().split('T')[0];

        if (lastFed === today) {
            return res.json({
                success: true,
                data: { pet, message: 'Already fed today' },
            });
        }

        // Feed pet - give bonus XP
        const updatedPet = await prisma.pet.update({
            where: { userId: req.userId! },
            data: {
                xp: { increment: 10 },
                lastFed: new Date(),
            },
        });

        // Check for evolution
        let newStage = updatedPet.stage;
        if (updatedPet.xp >= 500 && updatedPet.stage !== 'Evolved') newStage = 'Evolved';
        else if (updatedPet.xp >= 300 && updatedPet.stage === 'Junior') newStage = 'Adult';
        else if (updatedPet.xp >= 100 && updatedPet.stage === 'Hatchling') newStage = 'Junior';
        else if (updatedPet.xp >= 50 && updatedPet.stage === 'Egg') newStage = 'Hatchling';

        if (newStage !== updatedPet.stage) {
            const evolvedPet = await prisma.pet.update({
                where: { userId: req.userId! },
                data: { stage: newStage },
            });

            return res.json({
                success: true,
                data: {
                    pet: evolvedPet,
                    evolved: true,
                    newStage,
                    message: `${evolvedPet.name} evolved to ${newStage}!`,
                },
            });
        }

        res.json({
            success: true,
            data: { pet: updatedPet, message: 'Pet fed successfully!' },
        });
    } catch (error) {
        next(error);
    }
});

// Get user stats
router.get('/stats', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId!;

        const [totalQuests, completedQuests, totalTasks, completedTasks, goals, journalEntries, pet] = await Promise.all([
            prisma.quest.count({ where: { userId } }),
            prisma.quest.count({ where: { userId, isCompleted: true } }),
            prisma.task.count({ where: { userId } }),
            prisma.task.count({ where: { userId, isCompleted: true } }),
            prisma.goal.count({ where: { userId } }),
            prisma.journalEntry.count({ where: { userId } }),
            prisma.pet.findUnique({ where: { userId } }),
        ]);

        // Calculate streak (simplified - days with completed quests)
        const recentQuests = await prisma.quest.findMany({
            where: { userId, isCompleted: true },
            orderBy: { completedAt: 'desc' },
            take: 30,
        });

        const uniqueDays = new Set(recentQuests.map(q =>
            q.completedAt?.toISOString().split('T')[0]
        )).size;

        res.json({
            success: true,
            data: {
                stats: {
                    totalQuests,
                    completedQuests,
                    questCompletionRate: totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0,
                    totalTasks,
                    completedTasks,
                    taskCompletionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
                    activeGoals: goals,
                    journalEntries,
                    petXp: pet?.xp || 0,
                    petStage: pet?.stage || 'Egg',
                    activeDays: uniqueDays,
                },
            },
        });
    } catch (error) {
        next(error);
    }
});

export default router;
