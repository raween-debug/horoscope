import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../theme';

interface StarryBackgroundProps {
    starCount?: number;
    children?: React.ReactNode;
}

interface Star {
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Seeded random for consistent star positions
const seededRandom = (seed: number): number => {
    const x = Math.sin(seed * 9999) * 10000;
    return x - Math.floor(x);
};

export const StarryBackground: React.FC<StarryBackgroundProps> = ({
    starCount = 100,
    children,
}) => {
    // Generate stars with consistent positions using seeded random
    const stars = useMemo((): Star[] => {
        const generatedStars: Star[] = [];
        for (let i = 0; i < starCount; i++) {
            generatedStars.push({
                id: i,
                x: seededRandom(i * 3 + 1) * SCREEN_WIDTH,
                y: seededRandom(i * 3 + 2) * SCREEN_HEIGHT * 1.5,
                size: seededRandom(i * 3 + 3) * 2 + 1,
                opacity: seededRandom(i * 3 + 4) * 0.6 + 0.2,
            });
        }
        return generatedStars;
    }, [starCount]);

    return (
        <View style={styles.container}>
            {/* Gradient layers */}
            <View style={styles.gradientLayer1} />
            <View style={styles.gradientLayer2} />
            <View style={styles.gradientLayer3} />

            {/* Stars */}
            {stars.map((star) => (
                <View
                    key={star.id}
                    style={[
                        styles.star,
                        {
                            left: star.x,
                            top: star.y,
                            width: star.size,
                            height: star.size,
                            opacity: star.opacity,
                            borderRadius: star.size / 2,
                        },
                    ]}
                />
            ))}

            {/* Larger accent stars */}
            <View style={[styles.accentStar, { left: '15%', top: '10%' }]} />
            <View style={[styles.accentStar, { left: '80%', top: '25%' }]} />
            <View style={[styles.accentStar, { left: '25%', top: '60%' }]} />
            <View style={[styles.accentStar, { left: '70%', top: '75%' }]} />
            <View style={[styles.accentStar, { left: '45%', top: '40%' }]} />

            {/* Nebula glow effects */}
            <View style={[styles.nebulaGlow, { left: '10%', top: '20%' }]} />
            <View style={[styles.nebulaGlow, styles.nebulaGlowPink, { right: '5%', top: '50%' }]} />

            {/* Content */}
            <View style={styles.content}>{children}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    gradientLayer1: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: colors.backgroundGradientStart,
    },
    gradientLayer2: {
        position: 'absolute',
        top: '30%',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.backgroundGradientMiddle,
        opacity: 0.7,
    },
    gradientLayer3: {
        position: 'absolute',
        top: '60%',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.backgroundGradientEnd,
        opacity: 0.5,
    },
    star: {
        position: 'absolute',
        backgroundColor: colors.starWhite,
    },
    accentStar: {
        position: 'absolute',
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.starWhite,
        shadowColor: colors.starWhite,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 3,
    },
    nebulaGlow: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: colors.primary,
        opacity: 0.08,
    },
    nebulaGlowPink: {
        backgroundColor: colors.accent,
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    content: {
        flex: 1,
    },
});
