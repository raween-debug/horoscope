import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Button } from '../../components/Button';
import { colors, spacing, typography } from '../../theme';
import { useStore } from '../../store/useStore';
import { Egg } from 'lucide-react-native';

export const EggUnlockScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { vibe, sign, timeAvailable, reminder } = route.params;
    const setUser = useStore((state) => state.setUser);
    const refreshDailyQuests = useStore((state) => state.refreshDailyQuests);

    const handleStart = () => {
        setUser({
            name: 'Traveler', // Default name
            vibe,
            sign,
            timeAvailable,
            reminder,
            hasOnboarded: true,
        });
        refreshDailyQuests();
        // Navigation will automatically switch to MainTabs because of the user state change in RootNavigator
    };

    return (
        <ScreenWrapper style={styles.container}>
            <View style={styles.content}>
                <View style={styles.eggContainer}>
                    <Egg size={120} color={colors.primary} />
                </View>

                <Text style={styles.title}>
                    Your {sign === 'NotSure' ? 'Starlight' : sign} Egg is ready
                </Text>
                <Text style={styles.subtitle}>
                    Complete goals to help it hatch and grow.
                </Text>
            </View>

            <Button
                title="Start Day 1"
                onPress={handleStart}
                style={styles.button}
            />
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    eggContainer: {
        marginBottom: spacing.xl,
        padding: spacing.xl,
        backgroundColor: colors.surface,
        borderRadius: 100,
        shadowColor: colors.primary,
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    title: {
        ...typography.h2,
        color: colors.text,
        textAlign: 'center',
        marginBottom: spacing.s,
    },
    subtitle: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
        paddingHorizontal: spacing.l,
    },
    button: {
        marginBottom: spacing.l,
        width: '100%',
    },
});
