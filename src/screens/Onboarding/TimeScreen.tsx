import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Button } from '../../components/Button';
import { colors, spacing, typography } from '../../theme';
import { TimeAvailable } from '../../types';

const TIMES: TimeAvailable[] = [5, 10, 20, 45];

export const TimeScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { vibe, sign } = route.params;
    const [selectedTime, setSelectedTime] = useState<TimeAvailable | null>(null);

    const handleNext = () => {
        if (selectedTime) {
            navigation.navigate('OnboardingReminders', { vibe, sign, timeAvailable: selectedTime });
        }
    };

    return (
        <ScreenWrapper>
            <View style={styles.header}>
                <Text style={styles.title}>Time available daily</Text>
                <Text style={styles.subtitle}>How much time can you commit?</Text>
            </View>

            <View style={styles.list}>
                {TIMES.map((time) => (
                    <TouchableOpacity
                        key={time}
                        style={[
                            styles.option,
                            selectedTime === time && styles.optionSelected,
                        ]}
                        onPress={() => setSelectedTime(time)}
                    >
                        <Text
                            style={[
                                styles.optionText,
                                selectedTime === time && styles.optionTextSelected,
                            ]}
                        >
                            {time === 45 ? '45+ minutes' : `${time} minutes`}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={{ flex: 1 }} />

            <Button
                title="Next"
                onPress={handleNext}
                disabled={!selectedTime}
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
