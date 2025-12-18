import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, layout, spacing, typography } from '../theme';
import { Star, Sun, Moon, Sparkles, Heart, Briefcase, TrendingUp } from 'lucide-react-native';

interface DailyHoroscope {
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

interface HoroscopeCardProps {
    horoscope: DailyHoroscope;
}

const HoroscopeCardComponent: React.FC<HoroscopeCardProps> = ({ horoscope }) => {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.signContainer}>
                    <View style={styles.iconCircle}>
                        <Sparkles size={24} color={colors.gold} />
                    </View>
                    <View>
                        <Text style={styles.signName}>{horoscope.sign}</Text>
                        <Text style={styles.date}>{horoscope.date}</Text>
                    </View>
                </View>
                <View style={styles.moodBadge}>
                    <Text style={styles.moodText}>{horoscope.mood}</Text>
                </View>
            </View>

            {/* Main Reading */}
            <Text style={styles.mainReading}>{horoscope.overall}</Text>

            {/* Divider with stars */}
            <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Star size={12} color={colors.gold} fill={colors.gold} />
                <View style={styles.dividerLine} />
            </View>

            {/* Detailed Sections */}
            <View style={styles.sectionsGrid}>
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Heart size={14} color={colors.accent} />
                        <Text style={styles.sectionTitle}>Love</Text>
                    </View>
                    <Text style={styles.sectionText}>{horoscope.love}</Text>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Briefcase size={14} color={colors.secondary} />
                        <Text style={styles.sectionTitle}>Career</Text>
                    </View>
                    <Text style={styles.sectionText}>{horoscope.career}</Text>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <TrendingUp size={14} color={colors.success} />
                        <Text style={styles.sectionTitle}>Wellness</Text>
                    </View>
                    <Text style={styles.sectionText}>{horoscope.wellness}</Text>
                </View>
            </View>

            {/* Lucky Section */}
            <View style={styles.luckySection}>
                <View style={styles.luckyItem}>
                    <Text style={styles.luckyLabel}>Lucky Number</Text>
                    <Text style={styles.luckyValue}>{horoscope.luckyNumber}</Text>
                </View>
                <View style={styles.luckyDivider} />
                <View style={styles.luckyItem}>
                    <Text style={styles.luckyLabel}>Lucky Color</Text>
                    <Text style={styles.luckyValue}>{horoscope.luckyColor}</Text>
                </View>
                <View style={styles.luckyDivider} />
                <View style={styles.luckyItem}>
                    <Text style={styles.luckyLabel}>Best Match</Text>
                    <Text style={styles.luckyValue}>{horoscope.compatibility}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        borderRadius: layout.borderRadius,
        padding: spacing.m,
        marginBottom: spacing.m,
        borderWidth: 1,
        borderColor: colors.border,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    signContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.s,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    signName: {
        ...typography.h3,
        color: colors.text,
    },
    date: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    moodBadge: {
        backgroundColor: colors.primary + '30',
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.xs,
        borderRadius: 20,
    },
    moodText: {
        ...typography.caption,
        fontWeight: '600',
        color: colors.primaryLight,
    },
    mainReading: {
        ...typography.body,
        color: colors.text,
        lineHeight: 24,
        marginBottom: spacing.m,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.m,
        gap: spacing.s,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border,
    },
    sectionsGrid: {
        gap: spacing.m,
        marginBottom: spacing.m,
    },
    section: {
        backgroundColor: colors.surfaceLight,
        borderRadius: layout.borderRadiusSmall,
        padding: spacing.s,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginBottom: spacing.xs,
    },
    sectionTitle: {
        ...typography.caption,
        fontWeight: '700',
        color: colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    sectionText: {
        ...typography.bodySmall,
        color: colors.text,
    },
    luckySection: {
        flexDirection: 'row',
        backgroundColor: colors.surfaceLight,
        borderRadius: layout.borderRadiusSmall,
        padding: spacing.m,
    },
    luckyItem: {
        flex: 1,
        alignItems: 'center',
    },
    luckyLabel: {
        ...typography.caption,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    luckyValue: {
        ...typography.body,
        fontWeight: '700',
        color: colors.gold,
    },
    luckyDivider: {
        width: 1,
        backgroundColor: colors.border,
        marginHorizontal: spacing.s,
    },
});

export const HoroscopeCard = memo(HoroscopeCardComponent);
