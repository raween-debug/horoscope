import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TodayScreen } from '../screens/Tabs/TodayScreen';
import { GoalsScreen } from '../screens/Tabs/GoalsScreen';
import { CalendarScreen } from '../screens/Tabs/CalendarScreen';
import { CompanionScreen } from '../screens/Tabs/CompanionScreen';
import { JournalScreen } from '../screens/Tabs/JournalScreen';
import { colors } from '../theme';
import { Sun, Target, Calendar, Heart, Book } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarStyle: {
                    borderTopColor: colors.border,
                    backgroundColor: colors.surface,
                    paddingTop: 8,
                    paddingBottom: 8,
                    height: 70,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '500',
                },
            }}
        >
            <Tab.Screen
                name="Today"
                component={TodayScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Sun color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="Goals"
                component={GoalsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Target color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="Calendar"
                component={CalendarScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="Companion"
                component={CompanionScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="Journal"
                component={JournalScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Book color={color} size={size} />
                }}
            />
        </Tab.Navigator>
    );
};
