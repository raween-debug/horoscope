import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { colors, layout, spacing, typography } from '../../theme';
import { useStore } from '../../store/useStore';
import { Heart, Star, Award, Lock } from 'lucide-react-native';

export const CompanionScreen = () => {
    const pet = useStore((state) => state.pet);
    const progress = (pet.xp % 100) / 100;

    return (
        <ScreenWrapper>
            <Text style={styles.title}>Companion</Text>

            <View style={styles.petContainer}>
                <View style={styles.petCircle}>
                    <Heart size={80} color={colors.surface} fill={colors.surface} />
                </View>
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petStage}>{pet.stage}</Text>

                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Star size={20} color={colors.warning} fill={colors.warning} />
                        <Text style={styles.statValue}>{pet.xp}</Text>
                        <Text style={styles.statLabel}>Total Stardust</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statItem}>
                        <Award size={20} color={colors.secondary} />
                        <Text style={styles.statValue}>{pet.streak}</Text>
                        <Text style={styles.statLabel}>Day Streak</Text>
                    </View>
                </View>
            </View>

            <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                    <Text style={styles.progressTitle}>Level {Math.floor(pet.xp / 100) + 1} Progress</Text>
                    <Text style={styles.progressValue}>{Math.floor(progress * 100)}%</Text>
                </View>
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
                </View>
                <Text style={styles.nextReward}>Next Reward: New Background at Level {Math.floor(pet.xp / 100) + 2}</Text>
            </View>

            <Text style={styles.sectionTitle}>Unlockables</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rewardsList}>
                <View style={styles.rewardCard}>
                    <View style={[styles.rewardIcon, { backgroundColor: colors.primary }]}>
                        <Star size={24} color={colors.surface} />
                    </View>
                    <Text style={styles.rewardName}>Basic Aura</Text>
                    <Text style={styles.rewardStatus}>Unlocked</Text>
                </View>

                <View style={[styles.rewardCard, styles.lockedCard]}>
                    <View style={styles.rewardIcon}>
                        <Lock size={24} color={colors.textSecondary} />
                    </View>
                    <Text style={styles.rewardName}>Cosmic Hat</Text>
                    <Text style={styles.rewardStatus}>Lvl 5</Text>
                </View>

                <View style={[styles.rewardCard, styles.lockedCard]}>
                    <View style={styles.rewardIcon}>
                        <Lock size={24} color={colors.textSecondary} />
                    </View>
                    <Text style={styles.rewardName}>Moon Base</Text>
                    <Text style={styles.rewardStatus}>Lvl 10</Text>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    title: {
        ...typography.h1,
        color: colors.text,
        marginBottom: spacing.l,
    },
    petContainer: {
        alignItems: 'center',
        backgroundColor: colors.primary,
        borderRadius: layout.borderRadius,
        padding: spacing.xl,
        marginBottom: spacing.l,
        ...layout.cardShadow,
    },
    petCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    petName: {
        ...typography.h2,
        color: colors.surface,
        marginBottom: 4,
    },
    petStage: {
        ...typography.body,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: spacing.l,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 12,
        padding: spacing.m,
        width: '100%',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    divider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    statValue: {
        ...typography.h3,
        color: colors.surface,
        marginTop: spacing.xs,
    },
    statLabel: {
        ...typography.caption,
        color: 'rgba(255,255,255,0.8)',
    },
    progressSection: {
        backgroundColor: colors.surface,
        borderRadius: layout.borderRadius,
        padding: spacing.m,
        marginBottom: spacing.l,
        ...layout.cardShadow,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.s,
    },
    progressTitle: {
        ...typography.h3,
        color: colors.text,
    },
    progressValue: {
        ...typography.h3,
        color: colors.primary,
    },
    progressBarBg: {
        height: 12,
        backgroundColor: colors.background,
        borderRadius: 6,
        marginBottom: spacing.s,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: 6,
    },
    nextReward: {
        ...typography.caption,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.text,
        marginBottom: spacing.m,
    },
    rewardsList: {
        gap: spacing.m,
        paddingBottom: spacing.xl,
    },
    rewardCard: {
        width: 100,
        backgroundColor: colors.surface,
        borderRadius: layout.borderRadius,
        padding: spacing.m,
        alignItems: 'center',
        ...layout.cardShadow,
    },
    lockedCard: {
        opacity: 0.7,
        backgroundColor: colors.background,
    },
    rewardIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.border,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.s,
    },
    rewardName: {
        ...typography.caption,
        fontWeight: '700',
        color: colors.text,
        textAlign: 'center',
        marginBottom: 2,
    },
    rewardStatus: {
        ...typography.caption,
        fontSize: 10,
        color: colors.textSecondary,
    },
});
