import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { colors, layout, spacing, typography } from '../../theme';
import { getCalendarEvents } from '../../services/calendarService';
import { Moon } from 'lucide-react-native';

export const CalendarScreen = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Memoize events fetch
    const events = useMemo(
        () => getCalendarEvents(currentMonth, currentYear),
        [currentMonth, currentYear]
    );

    // Memoize calendar calculations
    const { days, paddingDays, daysInMonth } = useMemo(() => {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        return {
            daysInMonth,
            days: Array.from({ length: daysInMonth }, (_, i) => i + 1),
            paddingDays: Array.from({ length: firstDayOfMonth }, (_, i) => i),
        };
    }, [currentMonth, currentYear]);

    return (
        <ScreenWrapper>
            <Text style={styles.title}>Calendar</Text>
            <Text style={styles.month}>{today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</Text>

            <View style={styles.calendarContainer}>
                <View style={styles.weekRow}>
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                        <Text key={i} style={styles.weekDay}>{day}</Text>
                    ))}
                </View>

                <View style={styles.daysGrid}>
                    {paddingDays.map((_, i) => (
                        <View key={`pad-${i}`} style={styles.dayCell} />
                    ))}
                    {days.map((day) => {
                        const isToday = day === today.getDate();
                        const hasEvent = events.some(e => new Date(e.date).getDate() === day);

                        return (
                            <View key={day} style={[styles.dayCell, isToday && styles.todayCell]}>
                                <Text style={[styles.dayText, isToday && styles.todayText]}>{day}</Text>
                                {hasEvent && <View style={styles.eventDot} />}
                            </View>
                        );
                    })}
                </View>
            </View>

            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <ScrollView contentContainerStyle={styles.eventsList}>
                {events.map((event, index) => (
                    <View key={index} style={styles.eventCard}>
                        <View style={styles.eventDate}>
                            <Text style={styles.eventDay}>{new Date(event.date).getDate()}</Text>
                            <Text style={styles.eventMonth}>{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</Text>
                        </View>
                        <View style={styles.eventContent}>
                            <Text style={styles.eventTitle}>{event.title}</Text>
                            <View style={styles.eventType}>
                                {event.type === 'Moon' && <Moon size={12} color={colors.secondary} />}
                                <Text style={styles.eventTypeText}>{event.type}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    title: {
        ...typography.h1,
        color: colors.text,
    },
    month: {
        ...typography.h3,
        color: colors.textSecondary,
        marginBottom: spacing.l,
    },
    calendarContainer: {
        backgroundColor: colors.surface,
        borderRadius: layout.borderRadius,
        padding: spacing.m,
        ...layout.cardShadow,
        marginBottom: spacing.l,
    },
    weekRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.s,
    },
    weekDay: {
        ...typography.caption,
        width: 32,
        textAlign: 'center',
        fontWeight: '700',
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: '14.28%', // 100% / 7
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    todayCell: {
        backgroundColor: colors.primary,
        borderRadius: 20,
    },
    dayText: {
        ...typography.body,
        color: colors.text,
    },
    todayText: {
        color: colors.surface,
        fontWeight: '700',
    },
    eventDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.secondary,
        position: 'absolute',
        bottom: 4,
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.text,
        marginBottom: spacing.m,
    },
    eventsList: {
        paddingBottom: spacing.xl,
    },
    eventCard: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderRadius: layout.borderRadius,
        padding: spacing.m,
        marginBottom: spacing.s,
        ...layout.cardShadow,
    },
    eventDate: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: spacing.m,
        borderRightWidth: 1,
        borderRightColor: colors.border,
        marginRight: spacing.m,
        width: 50,
    },
    eventDay: {
        ...typography.h3,
        color: colors.primary,
    },
    eventMonth: {
        ...typography.caption,
        textTransform: 'uppercase',
    },
    eventContent: {
        flex: 1,
        justifyContent: 'center',
    },
    eventTitle: {
        ...typography.body,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 4,
    },
    eventType: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    eventTypeText: {
        ...typography.caption,
        color: colors.textSecondary,
    },
});
