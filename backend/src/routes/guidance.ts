import { Router, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { generateDailyGuidance, generateDailyHoroscope } from '../services/horoscopeService';

const router = Router();
const prisma = new PrismaClient();

// Get daily guidance
router.get('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { date } = req.query;
        const dateStr = (date as string) || new Date().toISOString().split('T')[0];

        const user = await prisma.user.findUnique({ where: { id: req.userId } });
        const sign = user?.sign || 'NotSure';

        // Check cache
        let guidance = await prisma.dailyGuidance.findUnique({
            where: { sign_date: { sign, date: dateStr } },
        });

        if (!guidance) {
            const generated = generateDailyGuidance(sign as any, dateStr);
            guidance = await prisma.dailyGuidance.create({
                data: {
                    sign,
                    date: dateStr,
                    starGuidance: generated.starGuidance,
                    theme: generated.theme,
                    mode: generated.mode,
                    doList: JSON.stringify(generated.do),
                    avoidList: JSON.stringify(generated.avoid),
                    timingHint: generated.timingHint,
                },
            });
        }

        res.json({
            success: true,
            data: {
                guidance: {
                    date: guidance.date,
                    starGuidance: guidance.starGuidance,
                    theme: guidance.theme,
                    mode: guidance.mode,
                    do: JSON.parse(guidance.doList),
                    avoid: JSON.parse(guidance.avoidList),
                    timingHint: guidance.timingHint,
                },
            },
        });
    } catch (error) {
        next(error);
    }
});

// Get daily horoscope
router.get('/horoscope', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { date } = req.query;
        const dateStr = (date as string) || new Date().toISOString().split('T')[0];

        const user = await prisma.user.findUnique({ where: { id: req.userId } });
        const sign = user?.sign || 'NotSure';

        // Check cache
        let horoscope = await prisma.dailyHoroscope.findUnique({
            where: { sign_date: { sign, date: dateStr } },
        });

        if (!horoscope) {
            const generated = generateDailyHoroscope(sign as any, dateStr);
            horoscope = await prisma.dailyHoroscope.create({
                data: {
                    sign,
                    date: dateStr,
                    overall: generated.overall,
                    love: generated.love,
                    career: generated.career,
                    wellness: generated.wellness,
                    luckyNumber: generated.luckyNumber,
                    luckyColor: generated.luckyColor,
                    mood: generated.mood,
                    compatibility: generated.compatibility,
                },
            });
        }

        // Format date nicely
        const dateObj = new Date(dateStr);
        const formattedDate = dateObj.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        });

        res.json({
            success: true,
            data: {
                horoscope: {
                    sign: horoscope.sign === 'NotSure' ? 'Universal' : horoscope.sign,
                    date: formattedDate,
                    overall: horoscope.overall,
                    love: horoscope.love,
                    career: horoscope.career,
                    wellness: horoscope.wellness,
                    luckyNumber: horoscope.luckyNumber,
                    luckyColor: horoscope.luckyColor,
                    mood: horoscope.mood,
                    compatibility: horoscope.compatibility,
                },
            },
        });
    } catch (error) {
        next(error);
    }
});

export default router;
