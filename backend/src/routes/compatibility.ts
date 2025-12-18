import { Router, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

type StarSign = 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo' |
    'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

const COMPATIBILITY_DATA: Record<string, { score: number; strengths: string[]; friction: string; advice: string }> = {
    // Fire signs with other elements
    'Aries-Aries': { score: 75, strengths: ['Passion', 'Energy', 'Adventure'], friction: 'Both want to lead', advice: 'Take turns being in charge' },
    'Aries-Leo': { score: 90, strengths: ['Excitement', 'Loyalty', 'Fun'], friction: 'Ego clashes', advice: 'Celebrate each other\'s wins' },
    'Aries-Sagittarius': { score: 95, strengths: ['Adventure', 'Optimism', 'Freedom'], friction: 'Commitment fears', advice: 'Build trust through shared experiences' },
    'Aries-Taurus': { score: 55, strengths: ['Determination', 'Protection'], friction: 'Different paces', advice: 'Find compromise in timing' },
    'Aries-Cancer': { score: 45, strengths: ['Care', 'Protection'], friction: 'Emotional expression', advice: 'Learn each other\'s love language' },
    'Aries-Gemini': { score: 80, strengths: ['Curiosity', 'Energy', 'Fun'], friction: 'Focus issues', advice: 'Keep things interesting' },

    // More combinations
    'Leo-Leo': { score: 70, strengths: ['Drama', 'Romance', 'Creativity'], friction: 'Spotlight competition', advice: 'Share the stage' },
    'Leo-Sagittarius': { score: 90, strengths: ['Adventure', 'Generosity', 'Fun'], friction: 'Over-promising', advice: 'Ground big dreams in reality' },

    'Taurus-Taurus': { score: 85, strengths: ['Stability', 'Loyalty', 'Comfort'], friction: 'Stubbornness', advice: 'Practice flexibility' },
    'Taurus-Virgo': { score: 90, strengths: ['Practicality', 'Dedication', 'Trust'], friction: 'Perfectionism', advice: 'Embrace imperfection together' },
    'Taurus-Capricorn': { score: 95, strengths: ['Security', 'Goals', 'Loyalty'], friction: 'Workaholism', advice: 'Schedule quality time' },

    'Gemini-Gemini': { score: 70, strengths: ['Communication', 'Variety', 'Wit'], friction: 'Inconsistency', advice: 'Anchor each other' },
    'Gemini-Libra': { score: 90, strengths: ['Conversation', 'Social life', 'Ideas'], friction: 'Indecision', advice: 'Take turns deciding' },
    'Gemini-Aquarius': { score: 85, strengths: ['Innovation', 'Freedom', 'Intellect'], friction: 'Detachment', advice: 'Check in emotionally' },

    'Cancer-Cancer': { score: 75, strengths: ['Nurturing', 'Home', 'Emotion'], friction: 'Mood swings', advice: 'Create safe communication' },
    'Cancer-Scorpio': { score: 95, strengths: ['Depth', 'Intuition', 'Loyalty'], friction: 'Intensity', advice: 'Give space when needed' },
    'Cancer-Pisces': { score: 90, strengths: ['Empathy', 'Romance', 'Care'], friction: 'Over-sensitivity', advice: 'Build practical foundations' },

    'Virgo-Virgo': { score: 70, strengths: ['Organization', 'Health', 'Growth'], friction: 'Critical nature', advice: 'Focus on appreciation' },
    'Virgo-Capricorn': { score: 90, strengths: ['Goals', 'Practicality', 'Trust'], friction: 'All work', advice: 'Schedule fun' },

    'Libra-Libra': { score: 75, strengths: ['Harmony', 'Beauty', 'Romance'], friction: 'Conflict avoidance', advice: 'Address issues directly' },
    'Libra-Aquarius': { score: 85, strengths: ['Ideas', 'Social cause', 'Friendship'], friction: 'Detachment', advice: 'Nurture intimacy' },

    'Scorpio-Scorpio': { score: 80, strengths: ['Intensity', 'Loyalty', 'Transformation'], friction: 'Power struggles', advice: 'Build trust slowly' },
    'Scorpio-Pisces': { score: 95, strengths: ['Intuition', 'Depth', 'Devotion'], friction: 'Escapism', advice: 'Stay grounded together' },

    'Sagittarius-Sagittarius': { score: 85, strengths: ['Adventure', 'Philosophy', 'Freedom'], friction: 'Restlessness', advice: 'Create home base' },
    'Sagittarius-Aquarius': { score: 90, strengths: ['Independence', 'Ideas', 'Growth'], friction: 'Commitment', advice: 'Define your own rules' },

    'Capricorn-Capricorn': { score: 80, strengths: ['Ambition', 'Stability', 'Legacy'], friction: 'Workaholism', advice: 'Prioritize relationship' },

    'Aquarius-Aquarius': { score: 75, strengths: ['Innovation', 'Freedom', 'Ideals'], friction: 'Emotional distance', advice: 'Practice vulnerability' },

    'Pisces-Pisces': { score: 70, strengths: ['Creativity', 'Spirituality', 'Romance'], friction: 'Reality avoidance', advice: 'Support each other\'s dreams practically' },
};

const getCompatibility = (sign1: StarSign, sign2: StarSign) => {
    const key1 = `${sign1}-${sign2}`;
    const key2 = `${sign2}-${sign1}`;

    const data = COMPATIBILITY_DATA[key1] || COMPATIBILITY_DATA[key2];

    if (data) return data;

    // Generate default compatibility based on elements
    const fireSign = ['Aries', 'Leo', 'Sagittarius'];
    const earthSigns = ['Taurus', 'Virgo', 'Capricorn'];
    const airSigns = ['Gemini', 'Libra', 'Aquarius'];
    const waterSigns = ['Cancer', 'Scorpio', 'Pisces'];

    const getElement = (sign: StarSign) => {
        if (fireSign.includes(sign)) return 'fire';
        if (earthSigns.includes(sign)) return 'earth';
        if (airSigns.includes(sign)) return 'air';
        return 'water';
    };

    const el1 = getElement(sign1);
    const el2 = getElement(sign2);

    // Same element = good, compatible elements = okay, challenging = lower
    let score = 60;
    if (el1 === el2) score = 75;
    else if ((el1 === 'fire' && el2 === 'air') || (el1 === 'air' && el2 === 'fire')) score = 80;
    else if ((el1 === 'earth' && el2 === 'water') || (el1 === 'water' && el2 === 'earth')) score = 80;
    else if ((el1 === 'fire' && el2 === 'water') || (el1 === 'water' && el2 === 'fire')) score = 50;
    else if ((el1 === 'earth' && el2 === 'air') || (el1 === 'air' && el2 === 'earth')) score = 55;

    return {
        score,
        strengths: ['Growth potential', 'Learning from differences', 'Balance'],
        friction: 'Different approaches to life',
        advice: 'Appreciate what each brings to the relationship',
    };
};

// Calculate compatibility
router.post('/calculate', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { name, sign } = req.body;

        if (!name || !sign) {
            throw new AppError('Name and sign are required', 400);
        }

        const user = await prisma.user.findUnique({ where: { id: req.userId! } });
        const userSign = (user?.sign || 'Aries') as StarSign;

        const compatibility = getCompatibility(userSign, sign as StarSign);

        const profile = await prisma.compatibilityProfile.create({
            data: {
                userId: req.userId!,
                name,
                sign,
                vibeScore: compatibility.score,
                strengths: JSON.stringify(compatibility.strengths),
                friction: compatibility.friction,
                advice: compatibility.advice,
            },
        });

        res.json({
            success: true,
            data: {
                profile: {
                    ...profile,
                    strengths: compatibility.strengths,
                },
            },
        });
    } catch (error) {
        next(error);
    }
});

// Get saved profiles
router.get('/profiles', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const profiles = await prisma.compatibilityProfile.findMany({
            where: { userId: req.userId! },
            orderBy: { createdAt: 'desc' },
        });

        const formattedProfiles = profiles.map(p => ({
            ...p,
            strengths: JSON.parse(p.strengths),
        }));

        res.json({
            success: true,
            data: { profiles: formattedProfiles },
        });
    } catch (error) {
        next(error);
    }
});

// Delete profile
router.delete('/profiles/:id', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const profile = await prisma.compatibilityProfile.findFirst({
            where: { id, userId: req.userId! },
        });

        if (!profile) {
            throw new AppError('Profile not found', 404);
        }

        await prisma.compatibilityProfile.delete({ where: { id } });

        res.json({
            success: true,
            data: { message: 'Profile deleted' },
        });
    } catch (error) {
        next(error);
    }
});

export default router;
