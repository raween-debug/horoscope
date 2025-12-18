import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper, ProgressBar, EmptyState, Button } from '../../components';
import { colors, layout, spacing, typography } from '../../theme';
import { useStore } from '../../store/useStore';
import { Plus, Flag } from 'lucide-react-native';

export const GoalsScreen = () => {
    const goals = useStore((state) => state.goals);
    // Mock adding a goal for MVP demo
    const addMockGoal = () => {
        // In real app, this would open "Build My Plan"
        console.log('Open Build My Plan');
    };

    return (
        <ScreenWrapper>
            <View style={styles.header}>
                <Text style={styles.title}>Your Goals</Text>
                <TouchableOpacity onPress={addMockGoal} style={styles.addButton}>
                    <Plus size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {goals.length === 0 ? (
                    <EmptyState
                        icon={<Flag size={48} color={colors.textSecondary} />}
                        title="No active goals yet"
                        subtitle="Start a new track to grow your companion."
                        action={
                            <Button
                                title="Build My Plan"
                                onPress={addMockGoal}
                            />
                        }
                    />
                ) : (
                    goals.map((goal) => (
                        <View key={goal.id} style={styles.goalCard}>
                            <View style={styles.goalHeader}>
                                <Text style={styles.goalTitle}>{goal.title}</Text>
                                <Text style={styles.goalProgress}>{goal.progress}%</Text>
                            </View>
                            <ProgressBar
                                progress={goal.progress}
                                style={styles.progressBar}
                            />
                            <Text style={styles.nextStep}>Next: {goal.dailyMicroStep}</Text>
                        </View>
                    ))
                )}

                {/* Mock Goal for visual if empty */}
                {goals.length === 0 && (
                    <View style={[styles.goalCard, styles.mockCard]}>
                        <View style={styles.goalHeader}>
                            <Text style={styles.goalTitle}>Example: Learn Spanish</Text>
                            <Text style={styles.goalProgress}>15%</Text>
                        </View>
                        <ProgressBar progress={15} style={styles.progressBar} />
                        <Text style={styles.nextStep}>Next: Practice 5 mins on Duolingo</Text>
                    </View>
                )}
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.l,
    },
    title: {
        ...typography.h1,
        color: colors.text,
    },
    addButton: {
        padding: spacing.s,
    },
    content: {
        paddingBottom: spacing.xxl,
    },
    goalCard: {
        backgroundColor: colors.surface,
        borderRadius: layout.borderRadius,
        padding: spacing.m,
        marginBottom: spacing.m,
        ...layout.cardShadow,
    },
    mockCard: {
        opacity: 0.7,
    },
    goalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.s,
    },
    goalTitle: {
        ...typography.h3,
        color: colors.text,
    },
    goalProgress: {
        ...typography.caption,
        fontWeight: '700',
        color: colors.primary,
    },
    progressBar: {
        marginBottom: spacing.m,
    },
    nextStep: {
        ...typography.body,
        color: colors.textSecondary,
    },
});
