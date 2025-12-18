import React, { memo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, layout, spacing, typography } from '../theme';
import { Quest } from '../types';
import { CheckCircle, Circle, Clock } from 'lucide-react-native';

interface QuestCardProps {
    quest: Quest;
    onToggle: (id: string) => void;
}

const QuestCardComponent: React.FC<QuestCardProps> = ({ quest, onToggle }) => {
    const isCompleted = quest.isCompleted;

    const getBorderColor = () => {
        if (isCompleted) return colors.success;
        switch (quest.type) {
            case 'Main': return colors.primary;
            case 'Side': return colors.secondary;
            case 'Recovery': return colors.accent;
            default: return colors.border;
        }
    };

    return (
        <TouchableOpacity
            style={[styles.container, { borderLeftColor: getBorderColor() }]}
            onPress={() => onToggle(quest.id)}
            activeOpacity={0.7}
        >
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={[styles.type, { color: getBorderColor() }]}>{quest.type} Quest</Text>
                    <View style={styles.timeContainer}>
                        <Clock size={12} color={colors.textSecondary} />
                        <Text style={styles.timeText}>{quest.estimatedMinutes}m</Text>
                    </View>
                </View>

                <Text style={[styles.title, isCompleted && styles.completedTitle]}>
                    {quest.title}
                </Text>

                {!isCompleted && quest.tinyVersion && (
                    <Text style={styles.tinyVersion}>
                        Tiny version: {quest.tinyVersion}
                    </Text>
                )}
            </View>

            <View style={styles.checkbox}>
                {isCompleted ? (
                    <CheckCircle size={24} color={colors.success} fill={colors.success + '20'} />
                ) : (
                    <Circle size={24} color={colors.border} />
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: layout.borderRadius,
        padding: spacing.m,
        marginBottom: spacing.s,
        borderLeftWidth: 4,
        borderWidth: 1,
        borderColor: colors.border,
    },
    content: {
        flex: 1,
        marginRight: spacing.m,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xs,
    },
    type: {
        ...typography.caption,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    timeText: {
        ...typography.caption,
    },
    title: {
        ...typography.body,
        fontWeight: '600',
        color: colors.text,
    },
    completedTitle: {
        textDecorationLine: 'line-through',
        color: colors.textSecondary,
    },
    tinyVersion: {
        ...typography.caption,
        marginTop: spacing.xs,
        fontStyle: 'italic',
    },
    checkbox: {
        padding: spacing.xs,
    },
});

// Memoize to prevent re-renders when parent state changes
export const QuestCard = memo(QuestCardComponent);
