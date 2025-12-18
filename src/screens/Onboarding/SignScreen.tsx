import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Button } from '../../components/Button';
import { colors, spacing, typography } from '../../theme';
import { StarSign } from '../../types';

const SIGNS: StarSign[] = [
    'Aries', 'Taurus', 'Gemini', 'Cancer',
    'Leo', 'Virgo', 'Libra', 'Scorpio',
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export const SignScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { vibe } = route.params;
    const [selectedSign, setSelectedSign] = useState<StarSign | null>(null);

    const handleNext = () => {
        navigation.navigate('OnboardingTime', { vibe, sign: selectedSign || 'NotSure' });
    };

    return (
        <ScreenWrapper>
            <View style={styles.header}>
                <Text style={styles.title}>Pick your star sign</Text>
                <Text style={styles.subtitle}>This determines your companion egg.</Text>
            </View>

            <FlatList
                data={SIGNS}
                numColumns={2}
                keyExtractor={(item) => item}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.option,
                            selectedSign === item && styles.optionSelected,
                        ]}
                        onPress={() => setSelectedSign(item)}
                    >
                        <Text
                            style={[
                                styles.optionText,
                                selectedSign === item && styles.optionTextSelected,
                            ]}
                        >
                            {item}
                        </Text>
                    </TouchableOpacity>
                )}
                ListFooterComponent={
                    <TouchableOpacity
                        style={[
                            styles.option,
                            styles.skipOption,
                            selectedSign === 'NotSure' && styles.optionSelected,
                        ]}
                        onPress={() => setSelectedSign('NotSure')}
                    >
                        <Text style={[styles.optionText, selectedSign === 'NotSure' && styles.optionTextSelected]}>
                            Not sure / Skip
                        </Text>
                    </TouchableOpacity>
                }
            />

            <Button
                title="Next"
                onPress={handleNext}
                disabled={!selectedSign}
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
        paddingBottom: spacing.xxl,
    },
    row: {
        gap: spacing.m,
    },
    option: {
        flex: 1,
        padding: spacing.m,
        borderRadius: 12,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
    },
    skipOption: {
        marginTop: spacing.m,
        flex: 0,
        width: '100%',
    },
    optionSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.primary + '10',
    },
    optionText: {
        ...typography.body,
        fontWeight: '600',
        color: colors.text,
    },
    optionTextSelected: {
        color: colors.primary,
    },
    button: {
        marginTop: spacing.s,
    },
});
