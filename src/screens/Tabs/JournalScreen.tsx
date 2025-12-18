import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { colors, layout, spacing, typography } from '../../theme';
import { drawTarotCard } from '../../services/journalService';
import { Button } from '../../components/Button';
import { BookOpen, PenTool } from 'lucide-react-native';

export const JournalScreen = () => {
    const [card, setCard] = useState<{ name: string; meaning: string } | null>(null);
    const [isRevealed, setIsRevealed] = useState(false);

    const handleDrawCard = () => {
        const newCard = drawTarotCard();
        setCard(newCard);
        setIsRevealed(true);
    };

    const resetCard = () => {
        setIsRevealed(false);
        setTimeout(() => setCard(null), 300);
    };

    return (
        <ScreenWrapper>
            <Text style={styles.title}>Journal & Tarot</Text>

            <View style={styles.tarotSection}>
                <Text style={styles.sectionTitle}>Daily Draw</Text>

                {!isRevealed ? (
                    <TouchableOpacity style={styles.cardBack} onPress={handleDrawCard}>
                        <View style={styles.cardPattern} />
                        <Text style={styles.tapText}>Tap to reveal</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.cardFront}>
                        <Text style={styles.cardName}>{card?.name}</Text>
                        <Text style={styles.cardMeaning}>{card?.meaning}</Text>
                        <Button
                            title="Draw Again"
                            onPress={resetCard}
                            variant="ghost"
                            style={{ marginTop: spacing.m }}
                        />
                    </View>
                )}
            </View>

            <View style={styles.journalSection}>
                <View style={styles.journalHeader}>
                    <Text style={styles.sectionTitle}>Recent Entries</Text>
                    <TouchableOpacity>
                        <PenTool size={20} color={colors.primary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.entryCard}>
                    <View style={styles.entryHeader}>
                        <Text style={styles.entryDate}>Yesterday</Text>
                        <BookOpen size={16} color={colors.textSecondary} />
                    </View>
                    <Text style={styles.entryPreview}>
                        Felt really productive today. The "Focus" mode helped me clear my inbox...
                    </Text>
                </View>

                <View style={styles.entryCard}>
                    <View style={styles.entryHeader}>
                        <Text style={styles.entryDate}>2 days ago</Text>
                        <BookOpen size={16} color={colors.textSecondary} />
                    </View>
                    <Text style={styles.entryPreview}>
                        Struggled a bit with motivation, but the side quest was easy enough to get me started.
                    </Text>
                </View>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    title: {
        ...typography.h1,
        color: colors.text,
        marginBottom: spacing.l,
    },
    tarotSection: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.text,
        marginBottom: spacing.m,
        alignSelf: 'flex-start',
    },
    cardBack: {
        width: 200,
        height: 300,
        backgroundColor: colors.primary,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        ...layout.cardShadow,
    },
    cardPattern: {
        width: 180,
        height: 280,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
        borderRadius: 12,
        borderStyle: 'dashed',
    },
    tapText: {
        ...typography.h3,
        color: colors.surface,
        position: 'absolute',
    },
    cardFront: {
        width: 200,
        height: 300,
        backgroundColor: colors.surface,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.m,
        borderWidth: 1,
        borderColor: colors.border,
        ...layout.cardShadow,
    },
    cardName: {
        ...typography.h2,
        color: colors.primary,
        textAlign: 'center',
        marginBottom: spacing.s,
    },
    cardMeaning: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    journalSection: {
        flex: 1,
    },
    journalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    entryCard: {
        backgroundColor: colors.surface,
        borderRadius: layout.borderRadius,
        padding: spacing.m,
        marginBottom: spacing.s,
        ...layout.cardShadow,
    },
    entryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xs,
    },
    entryDate: {
        ...typography.caption,
        fontWeight: '700',
        color: colors.textSecondary,
    },
    entryPreview: {
        ...typography.body,
        color: colors.text,
    },
});
