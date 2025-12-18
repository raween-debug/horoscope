import { Router, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Get all tasks
router.get('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const tasks = await prisma.task.findMany({
            where: { userId: req.userId! },
            orderBy: [{ isTop3: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
        });

        res.json({
            success: true,
            data: { tasks },
        });
    } catch (error) {
        next(error);
    }
});

// Create task
router.post('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { title, isTop3 } = req.body;

        if (!title?.trim()) {
            throw new AppError('Title is required', 400);
        }

        const task = await prisma.task.create({
            data: {
                userId: req.userId!,
                title: title.trim(),
                isTop3: isTop3 || false,
            },
        });

        res.status(201).json({
            success: true,
            data: { task },
        });
    } catch (error) {
        next(error);
    }
});

// Toggle task completion
router.patch('/:id/toggle', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const task = await prisma.task.findFirst({
            where: { id, userId: req.userId! },
        });

        if (!task) {
            throw new AppError('Task not found', 404);
        }

        const updatedTask = await prisma.task.update({
            where: { id },
            data: { isCompleted: !task.isCompleted },
        });

        res.json({
            success: true,
            data: { task: updatedTask },
        });
    } catch (error) {
        next(error);
    }
});

// Update task
router.patch('/:id', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { title, isTop3, order } = req.body;

        const task = await prisma.task.findFirst({
            where: { id, userId: req.userId! },
        });

        if (!task) {
            throw new AppError('Task not found', 404);
        }

        const updatedTask = await prisma.task.update({
            where: { id },
            data: {
                ...(title !== undefined && { title }),
                ...(isTop3 !== undefined && { isTop3 }),
                ...(order !== undefined && { order }),
            },
        });

        res.json({
            success: true,
            data: { task: updatedTask },
        });
    } catch (error) {
        next(error);
    }
});

// Delete task
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const task = await prisma.task.findFirst({
            where: { id, userId: req.userId! },
        });

        if (!task) {
            throw new AppError('Task not found', 404);
        }

        await prisma.task.delete({ where: { id } });

        res.json({
            success: true,
            data: { message: 'Task deleted' },
        });
    } catch (error) {
        next(error);
    }
});

// Sync tasks (bulk update)
router.post('/sync', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { tasks } = req.body;

        if (!Array.isArray(tasks)) {
            throw new AppError('Tasks must be an array', 400);
        }

        // Process each task
        for (const task of tasks) {
            if (task.id) {
                await prisma.task.upsert({
                    where: { id: task.id },
                    update: {
                        title: task.title,
                        isCompleted: task.isCompleted,
                        isTop3: task.isTop3,
                        order: task.order,
                    },
                    create: {
                        id: task.id,
                        userId: req.userId!,
                        title: task.title,
                        isCompleted: task.isCompleted || false,
                        isTop3: task.isTop3 || false,
                        order: task.order || 0,
                    },
                });
            }
        }

        const updatedTasks = await prisma.task.findMany({
            where: { userId: req.userId! },
            orderBy: [{ isTop3: 'desc' }, { order: 'asc' }],
        });

        res.json({
            success: true,
            data: { tasks: updatedTasks },
        });
    } catch (error) {
        next(error);
    }
});

export default router;
