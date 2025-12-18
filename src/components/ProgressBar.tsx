import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing } from '../theme';

interface ProgressBarProps {
    progress: number; // 0-1 or 0-100
    height?: number;
    backgroundColor?: string;
    fillColor?: string;
    style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    progress,
    height = 6,
    backgroundColor = colors.background,
    fillColor = colors.primary,
    style,
}) => {
    // Normalize progress to 0-100 range
    const normalizedProgress = progress > 1 ? progress : progress * 100;
    const clampedProgress = Math.min(100, Math.max(0, normalizedProgress));

    return (
        <View style={[styles.container, { height, backgroundColor }, style]}>
            <View
                style={[
                    styles.fill,
                    {
                        width: `${clampedProgress}%`,
                        backgroundColor: fillColor,
                        borderRadius: height / 2,
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 3,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
    },
});
