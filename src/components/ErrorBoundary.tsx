import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, layout } from '../theme';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log to error reporting service in production
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <View style={styles.container}>
                    <View style={styles.content}>
                        <Text style={styles.emoji}>✨</Text>
                        <Text style={styles.title}>Something went wrong</Text>
                        <Text style={styles.message}>
                            The stars misaligned for a moment. Let's try again.
                        </Text>
                        {__DEV__ && this.state.error && (
                            <Text style={styles.errorDetail}>
                                {this.state.error.message}
                            </Text>
                        )}
                        <TouchableOpacity style={styles.button} onPress={this.handleRetry}>
                            <Text style={styles.buttonText}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.l,
    },
    content: {
        backgroundColor: colors.surface,
        borderRadius: layout.borderRadius,
        padding: spacing.xl,
        alignItems: 'center',
        ...layout.cardShadow,
        maxWidth: 320,
        width: '100%',
    },
    emoji: {
        fontSize: 48,
        marginBottom: spacing.m,
    },
    title: {
        ...typography.h2,
        color: colors.text,
        textAlign: 'center',
        marginBottom: spacing.s,
    },
    message: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.l,
    },
    errorDetail: {
        ...typography.caption,
        color: colors.error,
        textAlign: 'center',
        marginBottom: spacing.m,
        fontFamily: 'monospace',
    },
    button: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.l,
        paddingVertical: spacing.m,
        borderRadius: layout.borderRadius,
    },
    buttonText: {
        ...typography.h3,
        fontSize: 16,
        color: colors.surface,
    },
});
