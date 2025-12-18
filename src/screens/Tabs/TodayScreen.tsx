import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper, GuidanceCard, QuestCard, CompanionWidget, HoroscopeCard } from '../../components';
import { useStore } from '../../store/useStore';
import { getTodayGuidance, getDailyHoroscope, DailyHoroscope } from '../../services/guidanceService';
import { colors, layout, spacing, typography } from '../../theme';
import { DailyGuidance } from '../../types';
import { Settings, CheckCircle, Circle, Plus, X } from 'lucide-react-native';

export const TodayScreen = () => {
    const navigation = useNavigation<any>();
    const user = useStore((state) => state.user);
    const quests = useStore((state) => state.quests);
    const tasks = useStore((state) => state.tasks);
    const pet = useStore((state) => state.pet);
    const completeQuest = useStore((state) => state.completeQuest);
    const refreshDailyQuests = useStore((state) => state.refreshDailyQuests);
    const feedPet = useStore((state) => state.feedPet);
    const addTask = useStore((state) => state.addTask);
    const toggleTask = useStore((state) => state.toggleTask);
    const deleteTask = useStore((state) => state.deleteTask);
    const checkAndRefreshQuests = useStore((state) => state.checkAndRefreshQuests);

    const [guidance, setGuidance] = useState<DailyGuidance | null>(null);
    const [horoscope, setHoroscope] = useState<DailyHoroscope | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [newTaskText, setNewTaskText] = useState('');
    const [isAddingTask, setIsAddingTask] = useState(false);

    useEffect(() => {
        if (user) {
            setGuidance(getTodayGuidance(user.sign));
            setHoroscope(getDailyHoroscope(user.sign));
            // Check if quests need refresh (new day check)
            checkAndRefreshQuests();
        }
    }, [user, checkAndRefreshQuests]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // Force refresh on pull-to-refresh
        refreshDailyQuests(true);
        if (user) {
            setGuidance(getTodayGuidance(user.sign));
            setHoroscope(getDailyHoroscope(user.sign));
        }
        setTimeout(() => setRefreshing(false), 1000);
    }, [user, refreshDailyQuests]);

    const handleAddTask = useCallback(() => {
        const trimmed = newTaskText.trim();
        if (trimmed) {
            addTask(trimmed);
            setNewTaskText('');
            setIsAddingTask(false);
        }
    }, [newTaskText, addTask]);

    const handleDeleteTask = useCallback((id: string, title: string) => {
        Alert.alert(
            'Delete Task',
            `Delete "${title}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deleteTask(id) }
            ]
        );
    }, [deleteTask]);

    const mainQuestCompleted = quests.find(q => q.type === 'Main')?.isCompleted;
    const top3Tasks = tasks.slice(0, 3); // Show first 3 tasks as "Top 3"

    if (!user || !guidance || !horoscope) return null;

    return (
        <ScreenWrapper noPadding>
            <View style={styles.header}>
                <View>
                    <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
                    <Text style={styles.greeting}>Hello, {user.name}</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                    <Settings size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <GuidanceCard guidance={guidance} />

                <Text style={styles.sectionTitle}>Your Daily Horoscope</Text>
                <HoroscopeCard horoscope={horoscope} />

                <Text style={styles.sectionTitle}>Daily Quests</Text>
                {quests.map((quest) => (
                    <QuestCard
                        key={quest.id}
                        quest={quest}
                        onToggle={completeQuest}
                    />
                ))}

                <Text style={styles.sectionTitle}>Top 3 Tasks</Text>
                <View style={styles.tasksContainer}>
                    {top3Tasks.length === 0 && !isAddingTask && (
                        <Text style={styles.emptyTasksText}>No tasks yet. Add your first task!</Text>
                    )}
                    {top3Tasks.map((task) => (
                        <TouchableOpacity
                            key={task.id}
                            style={styles.taskRow}
                            onPress={() => toggleTask(task.id)}
                            onLongPress={() => handleDeleteTask(task.id, task.title)}
                        >
                            {task.isCompleted ? (
                                <CheckCircle size={20} color={colors.success} />
                            ) : (
                                <Circle size={20} color={colors.border} />
                            )}
                            <Text style={[styles.taskText, task.isCompleted && styles.taskCompleted]}>
                                {task.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    {isAddingTask ? (
                        <View style={styles.addTaskInputRow}>
                            <TextInput
                                style={styles.taskInput}
                                value={newTaskText}
                                onChangeText={setNewTaskText}
                                placeholder="What needs to be done?"
                                placeholderTextColor={colors.textSecondary}
                                autoFocus
                                onSubmitEditing={handleAddTask}
                                returnKeyType="done"
                            />
                            <TouchableOpacity onPress={handleAddTask} style={styles.addTaskButton}>
                                <Plus size={20} color={colors.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setIsAddingTask(false); setNewTaskText(''); }} style={styles.cancelButton}>
                                <X size={20} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.addTaskRow} onPress={() => setIsAddingTask(true)}>
                            <Plus size={16} color={colors.textSecondary} />
                            <Text style={styles.addTaskText}>Add Task</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <Text style={styles.sectionTitle}>Companion</Text>
                <CompanionWidget
                    pet={pet}
                    onFeed={feedPet}
                    canFeed={!!mainQuestCompleted}
                />

                <View style={styles.nightRecap}>
                    <Text style={styles.recapTitle}>Night Recap</Text>
                    <Text style={styles.recapSubtitle}>Come back this evening to log your day.</Text>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.m,
        backgroundColor: 'transparent',
    },
    date: {
        ...typography.caption,
        textTransform: 'uppercase',
    },
    greeting: {
        ...typography.h2,
        color: colors.text,
    },
    scrollContent: {
        padding: spacing.m,
        paddingTop: 0,
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.text,
        marginTop: spacing.m,
        marginBottom: spacing.s,
    },
    nightRecap: {
        backgroundColor: colors.surfaceLight,
        borderRadius: 12,
        padding: spacing.m,
        marginTop: spacing.l,
        marginBottom: spacing.xxl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    recapTitle: {
        ...typography.h3,
        color: colors.text,
    },
    recapSubtitle: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: spacing.s,
    },
    tasksContainer: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: spacing.m,
        ...layout.cardShadow,
    },
    taskRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.m,
        gap: spacing.m,
    },
    taskText: {
        ...typography.body,
        color: colors.text,
        flex: 1,
    },
    taskCompleted: {
        textDecorationLine: 'line-through',
        color: colors.textSecondary,
    },
    emptyTasksText: {
        ...typography.body,
        color: colors.textSecondary,
        fontStyle: 'italic',
        textAlign: 'center',
        paddingVertical: spacing.s,
    },
    addTaskRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.xs,
        gap: spacing.s,
    },
    addTaskText: {
        ...typography.body,
        color: colors.textSecondary,
    },
    addTaskInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.s,
    },
    taskInput: {
        flex: 1,
        ...typography.body,
        color: colors.text,
        borderBottomWidth: 1,
        borderBottomColor: colors.primary,
        paddingVertical: spacing.xs,
    },
    addTaskButton: {
        padding: spacing.xs,
    },
    cancelButton: {
        padding: spacing.xs,
    },
});
