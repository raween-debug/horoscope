import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { generateToken, authenticate, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// Register
router.post(
    '/register',
    [
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 6 }),
        body('name').trim().notEmpty(),
        body('sign').notEmpty(),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new AppError('Validation failed', 400);
            }

            const { email, password, name, sign, timePreference } = req.body;

            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                throw new AppError('Email already registered', 400);
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    sign,
                    timePreference: timePreference || 20,
                    pet: {
                        create: {
                            name: 'Stardust',
                            xp: 0,
                            stage: 'Egg',
                        },
                    },
                },
                include: { pet: true },
            });

            const token = generateToken(user.id);

            res.status(201).json({
                success: true,
                data: {
                    token,
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
    }
);

// Login
router.post(
    '/login',
    [
        body('email').isEmail().normalizeEmail(),
        body('password').notEmpty(),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new AppError('Invalid credentials', 400);
            }

            const { email, password } = req.body;

            const user = await prisma.user.findUnique({
                where: { email },
                include: { pet: true },
            });

            if (!user) {
                throw new AppError('Invalid credentials', 401);
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                throw new AppError('Invalid credentials', 401);
            }

            const token = generateToken(user.id);

            res.json({
                success: true,
                data: {
                    token,
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
    }
);

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            include: { pet: true },
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

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

export default router;
