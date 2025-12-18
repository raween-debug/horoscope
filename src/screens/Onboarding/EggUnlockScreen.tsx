import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Easing,
    TouchableWithoutFeedback,
    Dimensions,
    Image,
    Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography } from '../../theme';
import { useStore } from '../../store/useStore';
import { StarSign } from '../../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Asset imports
const EGG_FRAMES = {
    frame1: require('../../../assets/egg-frame-1.png'),
    frame2: require('../../../assets/egg-frame-2.png'),
    frame3: require('../../../assets/egg-frame-3.png'),
};

const ZODIAC_PETS: Record<string, any> = {
    Aries: require('../../../assets/aries_transparent.png'),
    Taurus: require('../../../assets/taurus_transparent.png'),
    Gemini: require('../../../assets/gemini_transparent.png'),
    Cancer: require('../../../assets/cancer_transparent.png'),
    Leo: require('../../../assets/leo_transparent.png'),
    Virgo: require('../../../assets/virgo_transparent.png'),
    Libra: require('../../../assets/libra_transparent.png'),
    Scorpio: require('../../../assets/scorpio_transparent.png'),
    Sagittarius: require('../../../assets/saggitarius_transparent.png'),
    Capricorn: require('../../../assets/capricorn_transparent.png'),
    Aquarius: require('../../../assets/aquarius_transparent.png'),
    Pisces: require('../../../assets/pisces_transparent.png'),
    NotSure: require('../../../assets/leo_transparent.png'), // Default fallback
};

const PET_NAMES: Record<string, string> = {
    Aries: 'Ember',
    Taurus: 'Terra',
    Gemini: 'Zephyr',
    Cancer: 'Luna',
    Leo: 'Solaris',
    Virgo: 'Sage',
    Libra: 'Harmony',
    Scorpio: 'Shadow',
    Sagittarius: 'Blaze',
    Capricorn: 'Summit',
    Aquarius: 'Cascade',
    Pisces: 'Coral',
    NotSure: 'Stardust',
};

type HatchState = 'idle' | 'tap1' | 'tap2' | 'tap3' | 'hatching' | 'revealed' | 'complete';

// Particle component for magical effects
interface ParticleProps {
    delay: number;
    startX: number;
    startY: number;
    color: string;
    size: number;
    duration: number;
}

const Particle: React.FC<ParticleProps> = ({ delay, startX, startY, color, size, duration }) => {
    const animValue = useRef(new Animated.Value(0)).current;
    const angle = useRef(Math.random() * Math.PI * 2).current;
    const distance = useRef(80 + Math.random() * 120).current;

    useEffect(() => {
        const timeout = setTimeout(() => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(animValue, {
                        toValue: 1,
                        duration,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: true,
                    }),
                    Animated.timing(animValue, {
                        toValue: 0,
                        duration: 0,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }, delay);

        return () => clearTimeout(timeout);
    }, []);

    const translateX = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, Math.cos(angle) * distance],
    });

    const translateY = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, Math.sin(angle) * distance - 50],
    });

    const opacity = animValue.interpolate({
        inputRange: [0, 0.2, 0.8, 1],
        outputRange: [0, 1, 1, 0],
    });

    const scale = animValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 1.2, 0.3],
    });

    return (
        <Animated.View
            style={[
                styles.particle,
                {
                    left: startX,
                    top: startY,
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: color,
                    opacity,
                    transform: [{ translateX }, { translateY }, { scale }],
                },
            ]}
        />
    );
};

// Sparkle component for ambient effects
const Sparkle: React.FC<{ index: number }> = ({ index }) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0)).current;

    const position = useMemo(() => ({
        left: Math.random() * SCREEN_WIDTH,
        top: 100 + Math.random() * (SCREEN_HEIGHT - 300),
    }), []);

    useEffect(() => {
        const delay = index * 200 + Math.random() * 1000;

        const animation = Animated.loop(
            Animated.sequence([
                Animated.delay(delay),
                Animated.parallel([
                    Animated.timing(opacity, {
                        toValue: 0.8,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scale, {
                        toValue: 1,
                        duration: 800,
                        easing: Easing.out(Easing.back(2)),
                        useNativeDriver: true,
                    }),
                ]),
                Animated.delay(500),
                Animated.parallel([
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scale, {
                        toValue: 0,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.delay(Math.random() * 2000),
            ])
        );

        animation.start();
        return () => animation.stop();
    }, []);

    return (
        <Animated.View
            style={[
                styles.sparkle,
                {
                    left: position.left,
                    top: position.top,
                    opacity,
                    transform: [{ scale }],
                },
            ]}
        >
            <Text style={styles.sparkleText}>✦</Text>
        </Animated.View>
    );
};

// Light ray component for hatching effect
const LightRay: React.FC<{ angle: number; delay: number }> = ({ angle, delay }) => {
    const scaleY = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.delay(delay),
            Animated.parallel([
                Animated.timing(scaleY, {
                    toValue: 1,
                    duration: 600,
                    easing: Easing.out(Easing.exp),
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.9,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.lightRay,
                {
                    opacity,
                    transform: [
                        { rotate: `${angle}deg` },
                        { scaleY },
                    ],
                },
            ]}
        />
    );
};

export const EggUnlockScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { vibe, sign, timeAvailable, reminder } = route.params;
    const setUser = useStore((state) => state.setUser);
    const setPet = useStore((state) => state.setPet);
    const refreshDailyQuests = useStore((state) => state.refreshDailyQuests);

    const [hatchState, setHatchState] = useState<HatchState>('idle');
    const [showParticles, setShowParticles] = useState(false);
    const [showLightRays, setShowLightRays] = useState(false);

    // Animation values
    const eggScale = useRef(new Animated.Value(1)).current;
    const eggRotation = useRef(new Animated.Value(0)).current;
    const eggOpacity = useRef(new Animated.Value(1)).current;
    const glowScale = useRef(new Animated.Value(1)).current;
    const glowOpacity = useRef(new Animated.Value(0.3)).current;
    const petScale = useRef(new Animated.Value(0)).current;
    const petTranslateY = useRef(new Animated.Value(100)).current;
    const petOpacity = useRef(new Animated.Value(0)).current;
    const petRotation = useRef(new Animated.Value(0)).current;
    const instructionOpacity = useRef(new Animated.Value(1)).current;
    const nameOpacity = useRef(new Animated.Value(0)).current;
    const nameScale = useRef(new Animated.Value(0.5)).current;
    const buttonOpacity = useRef(new Animated.Value(0)).current;
    const buttonTranslateY = useRef(new Animated.Value(30)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(0)).current;

    const petName = PET_NAMES[sign] || PET_NAMES.NotSure;
    const zodiacPet = ZODIAC_PETS[sign] || ZODIAC_PETS.NotSure;

    // Idle floating animation
    useEffect(() => {
        const floatLoop = Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 2000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        );

        const pulseLoop = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0,
                    duration: 1500,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        );

        floatLoop.start();
        pulseLoop.start();

        return () => {
            floatLoop.stop();
            pulseLoop.stop();
        };
    }, []);

    // Glow pulse animation
    useEffect(() => {
        if (hatchState === 'idle' || hatchState.startsWith('tap')) {
            const intensity = hatchState === 'tap3' ? 0.8 : hatchState === 'tap2' ? 0.6 : hatchState === 'tap1' ? 0.5 : 0.3;

            Animated.loop(
                Animated.sequence([
                    Animated.timing(glowOpacity, {
                        toValue: intensity + 0.2,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(glowOpacity, {
                        toValue: intensity,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [hatchState]);

    const wobbleEgg = useCallback((intensity: number) => {
        Animated.sequence([
            Animated.timing(eggRotation, {
                toValue: intensity,
                duration: 80,
                useNativeDriver: true,
            }),
            Animated.timing(eggRotation, {
                toValue: -intensity,
                duration: 80,
                useNativeDriver: true,
            }),
            Animated.timing(eggRotation, {
                toValue: intensity * 0.7,
                duration: 70,
                useNativeDriver: true,
            }),
            Animated.timing(eggRotation, {
                toValue: -intensity * 0.7,
                duration: 70,
                useNativeDriver: true,
            }),
            Animated.timing(eggRotation, {
                toValue: intensity * 0.4,
                duration: 60,
                useNativeDriver: true,
            }),
            Animated.timing(eggRotation, {
                toValue: 0,
                duration: 60,
                useNativeDriver: true,
            }),
        ]).start();

        // Scale bounce
        Animated.sequence([
            Animated.timing(eggScale, {
                toValue: 1.1,
                duration: 100,
                easing: Easing.out(Easing.back(2)),
                useNativeDriver: true,
            }),
            Animated.spring(eggScale, {
                toValue: 1,
                friction: 3,
                tension: 100,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const triggerHatch = useCallback(() => {
        setShowLightRays(true);
        setShowParticles(true);

        // Hide instruction
        Animated.timing(instructionOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start();

        // Intense glow
        Animated.parallel([
            Animated.timing(glowScale, {
                toValue: 2.5,
                duration: 600,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
            }),
            Animated.timing(glowOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();

        // Egg explosion animation
        Animated.sequence([
            Animated.timing(eggScale, {
                toValue: 1.3,
                duration: 300,
                easing: Easing.out(Easing.back(3)),
                useNativeDriver: true,
            }),
            Animated.parallel([
                Animated.timing(eggScale, {
                    toValue: 0,
                    duration: 400,
                    easing: Easing.in(Easing.exp),
                    useNativeDriver: true,
                }),
                Animated.timing(eggOpacity, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();

        // After egg disappears, reveal pet
        setTimeout(() => {
            setHatchState('revealed');

            // Pet entrance animation
            Animated.parallel([
                Animated.spring(petScale, {
                    toValue: 1,
                    friction: 4,
                    tension: 40,
                    useNativeDriver: true,
                }),
                Animated.spring(petTranslateY, {
                    toValue: 0,
                    friction: 5,
                    tension: 50,
                    useNativeDriver: true,
                }),
                Animated.timing(petOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]).start();

            // Pet celebration spin
            Animated.sequence([
                Animated.timing(petRotation, {
                    toValue: 1,
                    duration: 600,
                    easing: Easing.out(Easing.back(1)),
                    useNativeDriver: true,
                }),
            ]).start();

            // Fade glow after reveal
            Animated.timing(glowOpacity, {
                toValue: 0.4,
                duration: 1000,
                useNativeDriver: true,
            }).start();

            // Show name after pet settles
            setTimeout(() => {
                Animated.parallel([
                    Animated.spring(nameOpacity, {
                        toValue: 1,
                        friction: 6,
                        useNativeDriver: true,
                    }),
                    Animated.spring(nameScale, {
                        toValue: 1,
                        friction: 5,
                        tension: 100,
                        useNativeDriver: true,
                    }),
                ]).start();

                // Show button
                setTimeout(() => {
                    setHatchState('complete');
                    Animated.parallel([
                        Animated.timing(buttonOpacity, {
                            toValue: 1,
                            duration: 400,
                            useNativeDriver: true,
                        }),
                        Animated.spring(buttonTranslateY, {
                            toValue: 0,
                            friction: 6,
                            useNativeDriver: true,
                        }),
                    ]).start();
                }, 600);
            }, 800);
        }, 700);
    }, []);

    const handleTap = useCallback(() => {
        if (hatchState === 'complete' || hatchState === 'hatching' || hatchState === 'revealed') return;

        const nextStates: Record<HatchState, HatchState> = {
            idle: 'tap1',
            tap1: 'tap2',
            tap2: 'tap3',
            tap3: 'hatching',
            hatching: 'hatching',
            revealed: 'revealed',
            complete: 'complete',
        };

        const nextState = nextStates[hatchState];
        setHatchState(nextState);

        if (nextState === 'tap1') {
            wobbleEgg(8);
        } else if (nextState === 'tap2') {
            wobbleEgg(12);
        } else if (nextState === 'tap3') {
            wobbleEgg(18);
        } else if (nextState === 'hatching') {
            triggerHatch();
        }
    }, [hatchState, wobbleEgg, triggerHatch]);

    const handleStart = useCallback(() => {
        setUser({
            name: 'Traveler',
            vibe,
            sign,
            timeAvailable,
            reminder,
            hasOnboarded: true,
        });

        // Update pet name to match zodiac
        setPet({
            name: petName,
            xp: 0,
            stage: 'Hatchling',
        });

        refreshDailyQuests();
    }, [vibe, sign, timeAvailable, reminder, petName]);

    const getEggFrame = () => {
        switch (hatchState) {
            case 'tap2':
                return EGG_FRAMES.frame2;
            case 'tap3':
            case 'hatching':
                return EGG_FRAMES.frame3;
            default:
                return EGG_FRAMES.frame1;
        }
    };

    const floatTranslateY = floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -15],
    });

    const glowPulseScale = pulseAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.15],
    });

    const eggRotationDeg = eggRotation.interpolate({
        inputRange: [-20, 20],
        outputRange: ['-20deg', '20deg'],
    });

    const petRotationDeg = petRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const tapProgress = hatchState === 'idle' ? 0 : hatchState === 'tap1' ? 1 : hatchState === 'tap2' ? 2 : 3;

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[colors.backgroundGradientStart, colors.backgroundGradientMiddle, colors.backgroundGradientEnd]}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Ambient sparkles */}
            {Array.from({ length: 20 }).map((_, i) => (
                <Sparkle key={i} index={i} />
            ))}

            {/* Light rays on hatch */}
            {showLightRays && (
                <View style={styles.lightRaysContainer}>
                    {Array.from({ length: 12 }).map((_, i) => (
                        <LightRay key={i} angle={i * 30} delay={i * 50} />
                    ))}
                </View>
            )}

            {/* Particles on hatch */}
            {showParticles && (
                <View style={styles.particlesContainer}>
                    {Array.from({ length: 30 }).map((_, i) => (
                        <Particle
                            key={i}
                            delay={i * 30}
                            startX={SCREEN_WIDTH / 2 - 5}
                            startY={SCREEN_HEIGHT / 2 - 80}
                            color={i % 3 === 0 ? colors.gold : i % 3 === 1 ? colors.primaryLight : colors.starWhite}
                            size={4 + Math.random() * 6}
                            duration={1000 + Math.random() * 500}
                        />
                    ))}
                </View>
            )}

            {/* Main content */}
            <View style={styles.content}>
                {/* Title area */}
                <View style={styles.titleArea}>
                    <Animated.Text style={[styles.title, { opacity: instructionOpacity }]}>
                        {sign === 'NotSure' ? 'A Mysterious' : `Your ${sign}`} Egg
                    </Animated.Text>
                    <Animated.Text style={[styles.subtitle, { opacity: instructionOpacity }]}>
                        Tap to awaken your companion
                    </Animated.Text>
                </View>

                {/* Egg/Pet container */}
                <TouchableWithoutFeedback onPress={handleTap}>
                    <View style={styles.eggArea}>
                        {/* Glow effect */}
                        <Animated.View
                            style={[
                                styles.glow,
                                {
                                    opacity: glowOpacity,
                                    transform: [
                                        { scale: Animated.multiply(glowScale, glowPulseScale) },
                                    ],
                                },
                            ]}
                        >
                            <LinearGradient
                                colors={[colors.primary + '00', colors.primary + '40', colors.primaryLight + '60', colors.primary + '40', colors.primary + '00']}
                                style={styles.glowGradient}
                                start={{ x: 0.5, y: 0.5 }}
                                end={{ x: 1, y: 1 }}
                            />
                        </Animated.View>

                        {/* Egg */}
                        {hatchState !== 'revealed' && hatchState !== 'complete' && (
                            <Animated.View
                                style={[
                                    styles.eggContainer,
                                    {
                                        opacity: eggOpacity,
                                        transform: [
                                            { translateY: floatTranslateY },
                                            { scale: eggScale },
                                            { rotate: eggRotationDeg },
                                        ],
                                    },
                                ]}
                            >
                                <Image source={getEggFrame()} style={styles.eggImage} resizeMode="contain" />
                            </Animated.View>
                        )}

                        {/* Pet */}
                        {(hatchState === 'revealed' || hatchState === 'complete') && (
                            <Animated.View
                                style={[
                                    styles.petContainer,
                                    {
                                        opacity: petOpacity,
                                        transform: [
                                            { translateY: Animated.add(petTranslateY, floatTranslateY) },
                                            { scale: petScale },
                                            { rotate: petRotationDeg },
                                        ],
                                    },
                                ]}
                            >
                                <Image source={zodiacPet} style={styles.petImage} resizeMode="contain" />
                            </Animated.View>
                        )}
                    </View>
                </TouchableWithoutFeedback>

                {/* Tap progress indicator */}
                {hatchState !== 'revealed' && hatchState !== 'complete' && hatchState !== 'hatching' && (
                    <Animated.View style={[styles.progressDots, { opacity: instructionOpacity }]}>
                        {[0, 1, 2].map((i) => (
                            <View
                                key={i}
                                style={[
                                    styles.progressDot,
                                    tapProgress > i && styles.progressDotActive,
                                ]}
                            />
                        ))}
                    </Animated.View>
                )}

                {/* Pet name reveal */}
                {(hatchState === 'revealed' || hatchState === 'complete') && (
                    <Animated.View
                        style={[
                            styles.nameContainer,
                            {
                                opacity: nameOpacity,
                                transform: [{ scale: nameScale }],
                            },
                        ]}
                    >
                        <Text style={styles.nameLabel}>Your companion</Text>
                        <Text style={styles.petName}>{petName}</Text>
                        <Text style={styles.nameSubtext}>has awakened ✦</Text>
                    </Animated.View>
                )}
            </View>

            {/* Start button */}
            {hatchState === 'complete' && (
                <Animated.View
                    style={[
                        styles.buttonContainer,
                        {
                            opacity: buttonOpacity,
                            transform: [{ translateY: buttonTranslateY }],
                        },
                    ]}
                >
                    <TouchableWithoutFeedback onPress={handleStart}>
                        <LinearGradient
                            colors={[colors.primary, colors.primaryLight]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Begin Your Journey</Text>
                        </LinearGradient>
                    </TouchableWithoutFeedback>
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.l,
    },
    titleArea: {
        position: 'absolute',
        top: 80,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: colors.text,
        textAlign: 'center',
        marginBottom: spacing.s,
        textShadowColor: colors.primary + '60',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    eggArea: {
        width: 280,
        height: 350,
        alignItems: 'center',
        justifyContent: 'center',
    },
    glow: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
    },
    glowGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 150,
    },
    eggContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    eggImage: {
        width: 200,
        height: 280,
    },
    petContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    petImage: {
        width: 220,
        height: 220,
    },
    progressDots: {
        flexDirection: 'row',
        gap: 12,
        marginTop: spacing.xl,
    },
    progressDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.border,
    },
    progressDotActive: {
        backgroundColor: colors.gold,
        shadowColor: colors.gold,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 6,
    },
    nameContainer: {
        alignItems: 'center',
        marginTop: spacing.xl,
    },
    nameLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: spacing.xs,
    },
    petName: {
        fontSize: 42,
        fontWeight: '800',
        color: colors.gold,
        textShadowColor: colors.gold + '60',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 30,
        letterSpacing: 2,
    },
    nameSubtext: {
        fontSize: 16,
        color: colors.primaryLight,
        marginTop: spacing.xs,
        letterSpacing: 1,
    },
    buttonContainer: {
        paddingHorizontal: spacing.l,
        paddingBottom: spacing.xxl,
        width: '100%',
    },
    button: {
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
        letterSpacing: 1,
    },
    sparkle: {
        position: 'absolute',
    },
    sparkleText: {
        fontSize: 16,
        color: colors.gold,
        textShadowColor: colors.gold,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
    lightRaysContainer: {
        position: 'absolute',
        top: SCREEN_HEIGHT / 2 - 80,
        left: SCREEN_WIDTH / 2,
        width: 0,
        height: 0,
    },
    lightRay: {
        position: 'absolute',
        width: 4,
        height: 200,
        backgroundColor: colors.gold,
        borderRadius: 2,
        left: -2,
        top: -200,
        transformOrigin: 'bottom',
        shadowColor: colors.gold,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
    },
    particlesContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    particle: {
        position: 'absolute',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 4,
    },
});
