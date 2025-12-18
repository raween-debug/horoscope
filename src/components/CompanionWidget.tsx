import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, layout, spacing, typography } from '../theme';
import { PetState } from '../types';
import { Heart, Star } from 'lucide-react-native';

interface CompanionWidgetProps {
    pet: PetState;
    onFeed: () => void;
    canFeed: boolean;
}

export const CompanionWidget: React.FC<CompanionWidgetProps> = ({ pet, onFeed, canFeed }) => {
    const progress = (pet.xp % 100) / 100;

    return (
        <View style={styles.container}>
            <View style={styles.petInfo}>
                <View style={styles.avatarPlaceholder}>
                    <Heart size={32} color={colors.starWhite} fill={colors.starWhite} />
                </View>
                <View>
                    <Text style={styles.name}>{pet.name}</Text>
                    <Text style={styles.stage}>{pet.stage} • Lvl {Math.floor(pet.xp / 100) + 1}</Text>
                </View>
            </View>

            <View style={styles.stats}>
                <View style={styles.xpContainer}>
                    <View style={styles.xpBarBg}>
                        <View style={[styles.xpBarFill, { width: `${progress * 100}%` }]} />
                    </View>
                    <Text style={styles.xpText}>{pet.xp % 100} / 100 XP</Text>
                </View>

                {canFeed && (
                    <TouchableOpacity style={styles.feedButton} onPress={onFeed}>
                        <Star size={16} color={colors.starWhite} fill={colors.starWhite} />
                        <Text style={styles.feedText}>Feed</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primary,
        borderRadius: layout.borderRadius,
        padding: spacing.m,
        marginBottom: spacing.m,
        ...layout.cardShadow,
    },
    petInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    avatarPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.m,
    },
    name: {
        ...typography.h3,
        color: colors.starWhite,
    },
    stage: {
        ...typography.caption,
        color: 'rgba(255,255,255,0.8)',
    },
    stats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.m,
    },
    xpContainer: {
        flex: 1,
    },
    xpBarBg: {
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 4,
        marginBottom: 4,
        overflow: 'hidden',
    },
    xpBarFill: {
        height: '100%',
        backgroundColor: colors.warning,
        borderRadius: 4,
    },
    xpText: {
        ...typography.caption,
        color: 'rgba(255,255,255,0.8)',
        fontSize: 10,
    },
    feedButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.s,
        borderRadius: 20,
        gap: 4,
    },
    feedText: {
        ...typography.caption,
        color: colors.starWhite,
        fontWeight: '700',
    },
});
