import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';
import { StarryBackground } from './StarryBackground';

interface ScreenWrapperProps {
    children: React.ReactNode;
    style?: ViewStyle;
    noPadding?: boolean;
    withStars?: boolean;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
    children,
    style,
    noPadding,
    withStars = true,
}) => {
    const content = (
        <SafeAreaView style={[styles.container, style]}>
            <View style={[styles.content, noPadding && { padding: 0 }]}>
                {children}
            </View>
        </SafeAreaView>
    );

    if (withStars) {
        return <StarryBackground>{content}</StarryBackground>;
    }

    return content;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    content: {
        flex: 1,
        padding: spacing.m,
    },
});
