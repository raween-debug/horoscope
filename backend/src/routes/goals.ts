import { Router, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Get all goals
router.get('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const goals = await prisma.goal.findMany({
            where: { userId: req.userId! },
            orderBy: { createdAt: 'desc' },
        });

        res.json({
            success: true,
            data: { goals },
        });
    } catch (error) {
        next(error);
    }
});

// Create goal
router.post('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { title, why, northStar, weeklyMilestone, dailyMicroStep, fallbackStep } = req.body;

        if (!title?.trim()) {
            throw new AppError('Title is required', 400);
        }

        const goal = await prisma.goal.create({
            data: {
                userId: req.userId!,
                title: title.trim(),
                why: why || '',
                northStar: northStar || '',
                weeklyMilestone: weeklyMilestone || '',
                dailyMicroStep: dailyMicroStep || '',
                fallbackStep: fallbackStep || '',
            },
        });

        res.status(201).json({
            success: true,
            data: { goal },
        });
    } catch (error) {
        next(error);
    }
});

// Get single goal
router.get('/:id', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const goal = await prisma.goal.findFirst({
            where: { id, userId: req.userId! },
        });

        if (!goal) {
            throw new AppError('Goal not found', 404);
        }

        res.json({
            success: true,
            data: { goal },
        });
    } catch (error) {
        next(error);
    }
});

// Update goal progress
router.patch('/:id', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { progress, title, why, northStar, weeklyMilestone, dailyMicroStep, fallbackStep } = req.body;

        const goal = await prisma.goal.findFirst({
            where: { id, userId: req.userId! },
        });

        if (!goal) {
            throw new AppError('Goal not found', 404);
        }

        const updatedGoal = await prisma.goal.update({
            where: { id },
            data: {
                ...(progress !== undefined && { progress: Math.min(100, Math.max(0, progress)) }),
                ...(title !== undefined && { title }),
                ...(why !== undefined && { why }),
                ...(northStar !== undefined && { northStar }),
                ...(weeklyMilestone !== undefined && { weeklyMilestone }),
                ...(dailyMicroStep !== undefined && { dailyMicroStep }),
                ...(fallbackStep !== undefined && { fallbackStep }),
            },
        });

        res.json({
            success: true,
            data: { goal: updatedGoal },
        });
    } catch (error) {
        next(error);
    }
});

// Pause goal
router.post('/:id/pause', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const goal = await prisma.goal.findFirst({
            where: { id, userId: req.userId! },
        });

        if (!goal) {
            throw new AppError('Goal not found', 404);
        }

        const updatedGoal = await prisma.goal.update({
            where: { id },
            data: { isPaused: true },
        });

        res.json({
            success: true,
            data: { goal: updatedGoal },
        });
    } catch (error) {
        next(error);
    }
});

// Resume goal
router.post('/:id/resume', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const goal = await prisma.goal.findFirst({
            where: { id, userId: req.userId! },
        });

        if (!goal) {
            throw new AppError('Goal not found', 404);
        }

        const updatedGoal = await prisma.goal.update({
            where: { id },
            data: { isPaused: false },
        });

        res.json({
            success: true,
            data: { goal: updatedGoal },
        });
    } catch (error) {
        next(error);
    }
});

// Delete goal
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const goal = await prisma.goal.findFirst({
            where: { id, userId: req.userId! },
        });

        if (!goal) {
            throw new AppError('Goal not found', 404);
        }

        await prisma.goal.delete({ where: { id } });

        res.json({
            success: true,
            data: { message: 'Goal deleted' },
        });
    } catch (error) {
        next(error);
    }
});

export default router;
