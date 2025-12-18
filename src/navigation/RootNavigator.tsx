import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useStore } from '../store/useStore';
import { TabNavigator } from './TabNavigator';
import { VibeScreen } from '../screens/Onboarding/VibeScreen';
import { SignScreen } from '../screens/Onboarding/SignScreen';
import { TimeScreen } from '../screens/Onboarding/TimeScreen';
import { RemindersScreen } from '../screens/Onboarding/RemindersScreen';
import { EggUnlockScreen } from '../screens/Onboarding/EggUnlockScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

export type RootStackParamList = {
    OnboardingVibe: undefined;
    OnboardingSign: undefined;
    OnboardingTime: undefined;
    OnboardingReminders: undefined;
    OnboardingEgg: undefined;
    MainTabs: undefined;
    Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
    const user = useStore((state) => state.user);
    const hasOnboarded = user?.hasOnboarded;

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!hasOnboarded ? (
                    <>
                        <Stack.Screen name="OnboardingVibe" component={VibeScreen} />
                        <Stack.Screen name="OnboardingSign" component={SignScreen} />
                        <Stack.Screen name="OnboardingTime" component={TimeScreen} />
                        <Stack.Screen name="OnboardingReminders" component={RemindersScreen} />
                        <Stack.Screen name="OnboardingEgg" component={EggUnlockScreen} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="MainTabs" component={TabNavigator} />
                        <Stack.Screen
                            name="Settings"
                            component={SettingsScreen}
                            options={{
                                headerShown: true,
                                headerBackTitle: 'Back',
                                title: 'Settings'
                            }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
