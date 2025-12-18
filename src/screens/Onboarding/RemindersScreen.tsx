import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Button } from '../../components/Button';
import { colors, spacing, typography } from '../../theme';
import { ReminderSetting } from '../../types';

const REMINDERS: ReminderSetting[] = ['Off', 'Morning', 'Evening'];

export const RemindersScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { vibe, sign, timeAvailable } = route.params;
    const [selectedReminder, setSelectedReminder] = useState<ReminderSetting | null>(null);

    const handleNext = () => {
        if (selectedReminder) {
            navigation.navigate('OnboardingEgg', { vibe, sign, timeAvailable, reminder: selectedReminder });
        }
    };

    return (
        <ScreenWrapper>
            <View style={styles.header}>
                <Text style={styles.title}>Set Reminders</Text>
                <Text style={styles.subtitle}>When should we nudge you?</Text>
            </View>

            <View style={styles.list}>
                {REMINDERS.map((item) => (
                    <TouchableOpacity
                        key={item}
                        style={[
                            styles.option,
                            selectedReminder === item && styles.optionSelected,
                        ]}
                        onPress={() => setSelectedReminder(item)}
                    >
                        <Text
                            style={[
                                styles.optionText,
                                selectedReminder === item && styles.optionTextSelected,
                            ]}
                        >
                            {item}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={{ flex: 1 }} />

            <Button
                title="Next"
                onPress={handleNext}
                disabled={!selectedReminder}
                style={styles.button}
            />
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    header: {
        marginTop: spacing.xl,
        marginBottom: spacing.l,
    },
    title: {
        ...typography.h1,
        color: colors.text,
        marginBottom: spacing.s,
    },
    subtitle: {
        ...typography.body,
        color: colors.textSecondary,
    },
    list: {
        gap: spacing.m,
    },
    option: {
        padding: spacing.m,
        borderRadius: 12,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    optionSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.primary + '10',
    },
    optionText: {
        ...typography.h3,
        color: colors.text,
    },
    optionTextSelected: {
        color: colors.primary,
    },
    button: {
        marginBottom: spacing.l,
    },
});
