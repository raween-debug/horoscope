import { DailyGuidance, StarSign } from '../types';
import { IGuidanceService, GetGuidanceRequest, ApiResponse, GuidanceResponse } from '../models/api';

// Extended horoscope interface
export interface DailyHoroscope {
    sign: string;
    date: string;
    overall: string;
    love: string;
    career: string;
    wellness: string;
    luckyNumber: number;
    luckyColor: string;
    mood: string;
    compatibility: string;
}

const THEMES = [
    "Embrace the unknown.",
    "Focus on your inner strength.",
    "Connect with an old friend.",
    "Take a moment to breathe.",
    "Push your boundaries today."
];

// Detailed horoscope readings per sign
const HOROSCOPE_READINGS: Record<StarSign, {
    overall: string[];
    love: string[];
    career: string[];
    wellness: string[];
    moods: string[];
}> = {
    Aries: {
        overall: [
            "The stars ignite your pioneering spirit today. Bold moves are favored, but temper your impulses with wisdom. A new beginning is on the horizon.",
            "Mars energizes your sector of action. Your competitive edge is sharp, making this an excellent day to tackle challenges head-on.",
            "Your natural leadership shines through. Others look to you for guidance. Trust your instincts and take the initiative.",
        ],
        love: ["Passion runs high. Express your feelings directly.", "A spontaneous gesture could spark romance.", "Your confidence attracts admirers."],
        career: ["Take the lead on a new project.", "Your courage impresses superiors.", "Bold ideas get noticed today."],
        wellness: ["Channel energy into physical activity.", "Avoid burnout by pacing yourself.", "Morning workouts are especially effective."],
        moods: ["Energized", "Bold", "Passionate", "Driven"],
    },
    Taurus: {
        overall: [
            "Venus blesses your practical endeavors. Financial matters look promising, and your steady approach wins the day. Comfort and stability are your allies.",
            "Your patience is rewarded today. What you've been building slowly starts to show results. Trust the process.",
            "Sensory pleasures bring joy. Take time to appreciate beauty around you. Your grounded energy attracts abundance.",
        ],
        love: ["Loyalty deepens existing bonds.", "Show love through acts of service.", "A stable connection brings comfort."],
        career: ["Financial planning pays off.", "Your reliability is recognized.", "Patience with slow progress is key."],
        wellness: ["Indulge in self-care rituals.", "Nature walks restore balance.", "Nourishing foods support your energy."],
        moods: ["Grounded", "Content", "Determined", "Peaceful"],
    },
    Gemini: {
        overall: [
            "Mercury activates your communication sector. Words flow easily, and mental connections spark. Share your ideas freely.",
            "Your curiosity leads to fascinating discoveries. Stay open to new information and unexpected conversations.",
            "Versatility is your superpower today. Juggle multiple interests without losing focus. Your adaptability impresses others.",
        ],
        love: ["Meaningful conversations deepen bonds.", "Flirtation comes naturally.", "A witty exchange could spark interest."],
        career: ["Networking opportunities abound.", "Your ideas gain traction.", "Written communication is favored."],
        wellness: ["Mental stimulation energizes you.", "Short breaks prevent restlessness.", "Try something new for fun."],
        moods: ["Curious", "Chatty", "Inspired", "Playful"],
    },
    Cancer: {
        overall: [
            "The Moon nurtures your emotional world. Home and family matters take priority. Trust your intuitive hunches.",
            "Your protective instincts are heightened. Care for those you love, but don't forget self-nurturing.",
            "Emotional depth brings wisdom today. Your sensitivity is a gift that helps you understand others.",
        ],
        love: ["Emotional intimacy deepens.", "Nurturing gestures strengthen bonds.", "Home-based dates feel magical."],
        career: ["Trust your gut in decisions.", "Collaborative projects flow well.", "Your empathy helps team dynamics."],
        wellness: ["Prioritize emotional well-being.", "Water activities soothe your soul.", "Rest when your body asks."],
        moods: ["Intuitive", "Nurturing", "Reflective", "Cozy"],
    },
    Leo: {
        overall: [
            "The Sun illuminates your creative expression. Your natural magnetism draws attention. Shine brightly and inspire others.",
            "Your generous spirit touches hearts today. Lead with warmth and watch others follow.",
            "Creative ventures are blessed. Express yourself boldly. Your authentic self-expression captivates audiences.",
        ],
        love: ["Romance takes center stage.", "Grand gestures win hearts.", "Your warmth attracts admirers."],
        career: ["Leadership roles suit you.", "Creative projects flourish.", "Recognition for your efforts comes."],
        wellness: ["Joy boosts your vitality.", "Express yourself through movement.", "Playful activities energize you."],
        moods: ["Radiant", "Confident", "Generous", "Creative"],
    },
    Virgo: {
        overall: [
            "Mercury sharpens your analytical mind. Details that others miss are clear to you. Your practical solutions save the day.",
            "Organization brings peace of mind. Tackle your to-do list with precision and feel the satisfaction of completion.",
            "Your helpful nature is appreciated. Offer your expertise where needed, but also accept help graciously.",
        ],
        love: ["Small gestures mean everything.", "Practical support shows love.", "Details in dating matter."],
        career: ["Your precision is valuable.", "Problem-solving skills shine.", "Organization leads to success."],
        wellness: ["Healthy routines pay off.", "Mind-body practices help.", "Don't overthink; just start."],
        moods: ["Analytical", "Helpful", "Focused", "Efficient"],
    },
    Libra: {
        overall: [
            "Venus harmonizes your relationships. Balance and beauty guide your day. Diplomatic skills are at their peak.",
            "Partnerships bring opportunities. Collaboration is favored over solo efforts. Seek win-win solutions.",
            "Aesthetic pleasures elevate your mood. Surround yourself with beauty and let harmony flow into all areas.",
        ],
        love: ["Harmony in relationships grows.", "Partnership energy is strong.", "Romantic gestures are well-received."],
        career: ["Negotiations go smoothly.", "Team projects thrive.", "Your fairness is valued."],
        wellness: ["Balance activity with rest.", "Beautiful surroundings heal.", "Social connections nurture you."],
        moods: ["Harmonious", "Charming", "Diplomatic", "Peaceful"],
    },
    Scorpio: {
        overall: [
            "Pluto intensifies your transformative powers. Deep insights emerge. What needs to end makes way for rebirth.",
            "Your investigative nature uncovers truths. Trust your ability to see beneath the surface.",
            "Emotional intensity fuels your passion. Channel this powerful energy into meaningful pursuits.",
        ],
        love: ["Deep connections are favored.", "Intimacy reaches new levels.", "Trust builds through vulnerability."],
        career: ["Research yields discoveries.", "Strategic thinking pays off.", "Power dynamics shift in your favor."],
        wellness: ["Release what no longer serves.", "Emotional processing heals.", "Regenerative rest is essential."],
        moods: ["Intense", "Perceptive", "Transforming", "Powerful"],
    },
    Sagittarius: {
        overall: [
            "Jupiter expands your horizons. Adventure calls and optimism soars. Big-picture thinking opens doors.",
            "Your philosophical nature seeks meaning. Explore new ideas and let curiosity guide your journey.",
            "Freedom and exploration are themes. Break free from limitations and embrace the unknown.",
        ],
        love: ["Adventure sparks romance.", "Honesty strengthens bonds.", "Shared philosophies connect hearts."],
        career: ["Big ideas get attention.", "International matters favor you.", "Teaching opportunities arise."],
        wellness: ["Outdoor activities energize.", "Mental expansion through learning.", "Optimism boosts immunity."],
        moods: ["Adventurous", "Optimistic", "Free-spirited", "Philosophical"],
    },
    Capricorn: {
        overall: [
            "Saturn rewards your discipline. Long-term goals advance. Your ambition and patience combine for success.",
            "Structure supports your progress. Build foundations that will last. Recognition for your efforts approaches.",
            "Your responsible nature earns respect. Leadership opportunities emerge from your steady reliability.",
        ],
        love: ["Commitment deepens bonds.", "Traditional gestures appreciated.", "Stability attracts partners."],
        career: ["Ambitions materialize.", "Authority figures support you.", "Long-term plans succeed."],
        wellness: ["Discipline in health pays off.", "Bone and joint care important.", "Rest supports productivity."],
        moods: ["Ambitious", "Disciplined", "Responsible", "Determined"],
    },
    Aquarius: {
        overall: [
            "Uranus sparks your innovative thinking. Revolutionary ideas emerge. Your unique perspective is needed.",
            "Community connections energize you. Group activities and humanitarian causes call to your heart.",
            "Your originality sets you apart. Embrace your eccentricities—they're your greatest assets.",
        ],
        love: ["Friendship deepens into more.", "Intellectual connection matters.", "Freedom within partnership."],
        career: ["Innovation is rewarded.", "Technology brings opportunities.", "Group projects succeed."],
        wellness: ["Social activities energize.", "Mental health prioritized.", "Unusual methods work best."],
        moods: ["Innovative", "Humanitarian", "Independent", "Visionary"],
    },
    Pisces: {
        overall: [
            "Neptune heightens your intuition. Dreams carry messages. Your compassionate nature heals those around you.",
            "Creative inspiration flows abundantly. Artistic pursuits are blessed. Trust your imagination.",
            "Spiritual connections deepen. The veil between worlds is thin. Pay attention to signs and synchronicities.",
        ],
        love: ["Soul connections intensify.", "Romantic dreams manifest.", "Compassion deepens bonds."],
        career: ["Creative projects flourish.", "Intuition guides decisions.", "Helping professions thrive."],
        wellness: ["Water heals your spirit.", "Rest and dreams restore.", "Boundaries protect energy."],
        moods: ["Dreamy", "Intuitive", "Compassionate", "Creative"],
    },
    NotSure: {
        overall: [
            "The cosmos holds unique gifts for you today. Stay open to the unexpected and trust your inner wisdom.",
            "Universal energies support your journey. Whatever sign you are, today favors authentic self-expression.",
            "The stars align to support your growth. Listen to your heart and let intuition guide your path.",
        ],
        love: ["Open your heart to possibilities.", "Authentic connection awaits.", "Love finds you unexpectedly."],
        career: ["Your unique talents shine.", "Opportunities appear when ready.", "Trust your path."],
        wellness: ["Listen to your body's wisdom.", "Balance is key today.", "Self-care nurtures growth."],
        moods: ["Open", "Curious", "Receptive", "Balanced"],
    },
};

const LUCKY_COLORS = ["Purple", "Gold", "Silver", "Blue", "Green", "Rose", "White", "Turquoise", "Coral", "Violet"];
const COMPATIBILITY_SIGNS: StarSign[] = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

const SIGN_MESSAGES: Record<StarSign, string> = {
    Aries: "Your fiery energy is amplified today. Channel it wisely.",
    Taurus: "Ground yourself in what brings you peace.",
    Gemini: "Your mind is especially sharp. Use it to solve puzzles.",
    Cancer: "Trust your intuition, it's guiding you home.",
    Leo: "Your natural charisma shines bright. Lead with heart.",
    Virgo: "Details matter today. Your precision is your superpower.",
    Libra: "Seek balance in all things. Harmony awaits.",
    Scorpio: "Transformation is calling. Embrace the change.",
    Sagittarius: "Adventure beckons. Follow your curiosity.",
    Capricorn: "Your determination moves mountains today.",
    Aquarius: "Innovation flows through you. Share your vision.",
    Pisces: "Dreams hold important messages. Pay attention.",
    NotSure: "The stars align in your favor today. Stay open to possibilities.",
};

/**
 * Seeded random number generator for deterministic results
 */
const seededRandom = (seed: number): number => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

/**
 * Get today's guidance - MOCK IMPLEMENTATION
 * Will be replaced with API call: GET /api/guidance?sign={sign}&date={date}
 */
export const getTodayGuidance = (sign: StarSign, dateOverride?: string): DailyGuidance => {
    const today = dateOverride ? new Date(dateOverride) : new Date();
    const dateStr = today.toISOString().split('T')[0];

    // Create deterministic seed from date
    const dateParts = dateStr.split('-').map(Number);
    const seed = dateParts[0] * 10000 + dateParts[1] * 100 + dateParts[2];

    const themeIndex = Math.floor(seededRandom(seed) * THEMES.length);
    const modeRandom = seededRandom(seed + 1);
    const mode = modeRandom < 0.33 ? 'Focus' : modeRandom < 0.66 ? 'Social' : 'Reset';
    const timingRandom = seededRandom(seed + 2);
    const timingHint = timingRandom < 0.33 ? 'Morning' : timingRandom < 0.66 ? 'Afternoon' : 'Evening';

    return {
        date: dateStr,
        starGuidance: SIGN_MESSAGES[sign] || SIGN_MESSAGES.NotSure,
        theme: THEMES[themeIndex],
        mode,
        do: ['Drink water', 'Take a walk', 'Write down 3 goals'],
        avoid: ['Procrastination', 'Negative talk', 'Skipping meals'],
        timingHint,
    };
};

/**
 * Get full daily horoscope - MOCK IMPLEMENTATION
 * Will be replaced with API call: GET /api/horoscope?sign={sign}&date={date}
 */
export const getDailyHoroscope = (sign: StarSign, dateOverride?: string): DailyHoroscope => {
    const today = dateOverride ? new Date(dateOverride) : new Date();
    const dateStr = today.toISOString().split('T')[0];

    // Create deterministic seed from date
    const dateParts = dateStr.split('-').map(Number);
    const seed = dateParts[0] * 10000 + dateParts[1] * 100 + dateParts[2];

    const readings = HOROSCOPE_READINGS[sign];

    // Select readings based on seed
    const overallIndex = Math.floor(seededRandom(seed) * readings.overall.length);
    const loveIndex = Math.floor(seededRandom(seed + 1) * readings.love.length);
    const careerIndex = Math.floor(seededRandom(seed + 2) * readings.career.length);
    const wellnessIndex = Math.floor(seededRandom(seed + 3) * readings.wellness.length);
    const moodIndex = Math.floor(seededRandom(seed + 4) * readings.moods.length);
    const colorIndex = Math.floor(seededRandom(seed + 5) * LUCKY_COLORS.length);
    const compatIndex = Math.floor(seededRandom(seed + 6) * COMPATIBILITY_SIGNS.length);
    const luckyNum = Math.floor(seededRandom(seed + 7) * 99) + 1;

    // Format date nicely
    const formattedDate = today.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });

    return {
        sign: sign === 'NotSure' ? 'Universal' : sign,
        date: formattedDate,
        overall: readings.overall[overallIndex],
        love: readings.love[loveIndex],
        career: readings.career[careerIndex],
        wellness: readings.wellness[wellnessIndex],
        luckyNumber: luckyNum,
        luckyColor: LUCKY_COLORS[colorIndex],
        mood: readings.moods[moodIndex],
        compatibility: COMPATIBILITY_SIGNS[compatIndex],
    };
};

/**
 * Service class implementation (for future API integration)
 */
export class GuidanceService implements IGuidanceService {
    async getTodayGuidance(request: GetGuidanceRequest): Promise<ApiResponse<GuidanceResponse>> {
        try {
            // MOCK: In production, this would be:
            // const response = await fetch(`/api/guidance?sign=${request.sign}&date=${request.date}`);
            // return await response.json();

            const guidance = getTodayGuidance(request.sign, request.date);
            return {
                success: true,
                data: { guidance },
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch guidance',
            };
        }
    }
}
