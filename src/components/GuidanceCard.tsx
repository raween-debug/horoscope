import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, layout, spacing, typography } from '../theme';
import { DailyGuidance } from '../types';
import { Sparkles, Zap, Moon, Sun } from 'lucide-react-native';

interface GuidanceCardProps {
    guidance: DailyGuidance;
}

const GuidanceCardComponent: React.FC<GuidanceCardProps> = ({ guidance }) => {
    const getModeIcon = () => {
        switch (guidance.mode) {
            case 'Focus': return <Zap size={20} color={colors.primary} />;
            case 'Social': return <Sun size={20} color={colors.warning} />;
            case 'Reset': return <Moon size={20} color={colors.secondary} />;
            default: return <Sparkles size={20} color={colors.primary} />;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Daily Star Guidance</Text>
                <View style={styles.modeBadge}>
                    {getModeIcon()}
                    <Text style={styles.modeText}>{guidance.mode} Mode</Text>
                </View>
            </View>

            <Text style={styles.guidanceText}>{guidance.starGuidance}</Text>

            <View style={styles.divider} />

            <Text style={styles.themeLabel}>Theme</Text>
            <Text style={styles.themeText}>{guidance.theme}</Text>

            <View style={styles.row}>
                <View style={styles.column}>
                    <Text style={styles.sectionTitle}>Do</Text>
                    {guidance.do.map((item, index) => (
                        <Text key={index} style={styles.bullet}>• {item}</Text>
                    ))}
                </View>
                <View style={styles.column}>
                    <Text style={styles.sectionTitle}>Avoid</Text>
                    {guidance.avoid.map((item, index) => (
                        <Text key={index} style={styles.bullet}>• {item}</Text>
                    ))}
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
        marginBottom: spacing.s,
    },
    title: {
        ...typography.h3,
        color: colors.primary,
    },
    modeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        paddingHorizontal: spacing.s,
        paddingVertical: spacing.xs,
        borderRadius: 16,
        gap: 4,
    },
    modeText: {
        ...typography.caption,
        fontWeight: '600',
        color: colors.text,
    },
    guidanceText: {
        ...typography.body,
        color: colors.text,
        marginBottom: spacing.m,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginBottom: spacing.m,
    },
    themeLabel: {
        ...typography.caption,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: spacing.xs,
    },
    themeText: {
        ...typography.h3,
        fontSize: 18,
        color: colors.text,
        marginBottom: spacing.m,
        fontStyle: 'italic',
    },
    row: {
        flexDirection: 'row',
        gap: spacing.m,
    },
    column: {
        flex: 1,
    },
    sectionTitle: {
        ...typography.body,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
    bullet: {
        ...typography.caption,
        fontSize: 13,
        marginBottom: 2,
        color: colors.textSecondary,
    },
});

// Memoize - guidance only changes once per day
export const GuidanceCard = memo(GuidanceCardComponent);
