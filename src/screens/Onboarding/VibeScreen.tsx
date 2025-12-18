import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Button } from '../../components/Button';
import { colors, spacing, typography } from '../../theme';
import { Vibe } from '../../types';
import { useStore } from '../../store/useStore';

const VIBES: { label: string; value: Vibe }[] = [
    { label: 'Get Organized', value: 'Organized' },
    { label: 'Get Focused', value: 'Focused' },
    { label: 'Feel Calmer', value: 'Calm' },
    { label: 'Get Stronger', value: 'Strong' },
    { label: 'Do Better at School/Work', value: 'SchoolWork' },
    { label: 'Improve Confidence', value: 'Confidence' },
];

export const VibeScreen = () => {
    const navigation = useNavigation<any>();
    const [selectedVibe, setSelectedVibe] = useState<Vibe | null>(null);
    const setUser = useStore((state) => state.setUser);

    const handleNext = () => {
        if (selectedVibe) {
            // Partially update user state (mocking a partial user object for now)
            // In reality we might want a separate onboarding store or just pass params
            // For simplicity, we'll just pass params or store in a local context, 
            // but here we can just pass it to the next screen or update the store incrementally if we allow partials.
            // Let's pass via navigation params for cleaner state management until the end.
            navigation.navigate('OnboardingSign', { vibe: selectedVibe });
        }
    };

    return (
        <ScreenWrapper>
            <View style={styles.header}>
                <Text style={styles.title}>Pick your vibe</Text>
                <Text style={styles.subtitle}>What's your main focus right now?</Text>
            </View>

            <FlatList
                data={VIBES}
                keyExtractor={(item) => item.value}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.option,
                            selectedVibe === item.value && styles.optionSelected,
                        ]}
                        onPress={() => setSelectedVibe(item.value)}
                    >
                        <Text
                            style={[
                                styles.optionText,
                                selectedVibe === item.value && styles.optionTextSelected,
                            ]}
                        >
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                )}
            />

            <Button
                title="Next"
                onPress={handleNext}
                disabled={!selectedVibe}
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
        backgroundColor: colors.primary + '10', // 10% opacity
    },
    optionText: {
        ...typography.h3,
        color: colors.text,
    },
    optionTextSelected: {
        color: colors.primary,
    },
    button: {
        marginTop: spacing.l,
    },
});
