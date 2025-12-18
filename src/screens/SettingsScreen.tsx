import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ScreenWrapper, Button } from '../components';
import { colors, layout, spacing, typography } from '../theme';
import { useStore } from '../store/useStore';
import { ChevronRight, User, Bell, Moon } from 'lucide-react-native';

export const SettingsScreen = () => {
    const user = useStore((state) => state.user);
    const reset = useStore((state) => state.reset);

    const handleLogout = () => {
        reset();
        // Navigation will automatically handle this via RootNavigator state check
    };

    return (
        <ScreenWrapper>
            <Text style={styles.title}>Settings</Text>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Profile</Text>
                    <TouchableOpacity style={styles.row}>
                        <View style={styles.rowLeft}>
                            <User size={20} color={colors.textSecondary} />
                            <Text style={styles.rowLabel}>Name</Text>
                        </View>
                        <View style={styles.rowRight}>
                            <Text style={styles.rowValue}>{user?.name}</Text>
                            <ChevronRight size={20} color={colors.textSecondary} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.row}>
                        <View style={styles.rowLeft}>
                            <Moon size={20} color={colors.textSecondary} />
                            <Text style={styles.rowLabel}>Star Sign</Text>
                        </View>
                        <View style={styles.rowRight}>
                            <Text style={styles.rowValue}>{user?.sign}</Text>
                            <ChevronRight size={20} color={colors.textSecondary} />
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <TouchableOpacity style={styles.row}>
                        <View style={styles.rowLeft}>
                            <Bell size={20} color={colors.textSecondary} />
                            <Text style={styles.rowLabel}>Reminders</Text>
                        </View>
                        <View style={styles.rowRight}>
                            <Text style={styles.rowValue}>{user?.reminder}</Text>
                            <ChevronRight size={20} color={colors.textSecondary} />
                        </View>
                    </TouchableOpacity>
                </View>

                <Button
                    title="Reset App Data"
                    onPress={handleLogout}
                    variant="outline"
                    style={styles.logoutButton}
                    textStyle={{ color: colors.error }}
                />
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    title: {
        ...typography.h1,
        color: colors.text,
        marginBottom: spacing.l,
    },
    content: {
        paddingBottom: spacing.xxl,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.textSecondary,
        marginBottom: spacing.s,
        marginLeft: spacing.xs,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: spacing.m,
        marginBottom: 1,
        borderRadius: layout.borderRadius,
        ...layout.cardShadow,
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.m,
    },
    rowLabel: {
        ...typography.body,
        color: colors.text,
    },
    rowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.s,
    },
    rowValue: {
        ...typography.body,
        color: colors.textSecondary,
    },
    logoutButton: {
        borderColor: colors.error,
        marginTop: spacing.xl,
    },
});
