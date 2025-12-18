import { TextStyle } from 'react-native';

// Dark cosmic theme - starry night aesthetic
export const colors = {
    // Primary backgrounds
    background: '#0D0D1A', // Deep space black
    backgroundGradientStart: '#0D0D1A',
    backgroundGradientMiddle: '#1A1A2E',
    backgroundGradientEnd: '#16213E',

    // Surface colors
    surface: '#1A1A2E', // Card backgrounds
    surfaceLight: '#252545', // Elevated surfaces

    // Brand colors
    primary: '#9D4EDD', // Cosmic purple
    primaryLight: '#C77DFF',
    primaryDark: '#7B2CBF',
    secondary: '#00D9FF', // Celestial cyan
    secondaryDark: '#00B4D8',
    accent: '#FF6B9D', // Nebula pink
    accentAlt: '#F72585', // Hot pink

    // Cosmic accents
    gold: '#FFD700', // Star gold
    starWhite: '#E8E8FF',
    nebulaPurple: '#5A189A',
    cosmicBlue: '#3A0CA3',

    // Text colors
    text: '#FFFFFF',
    textSecondary: '#A0A0B8',
    textMuted: '#6B6B80',

    // Utility colors
    border: '#2A2A4A',
    borderLight: '#3D3D5C',
    success: '#00F5A0',
    warning: '#FFE066',
    error: '#FF6B6B',

    // Gradients (use with LinearGradient)
    gradients: {
        cosmic: ['#0D0D1A', '#1A1A2E', '#16213E'],
        card: ['#1A1A2E', '#252545'],
        accent: ['#9D4EDD', '#C77DFF'],
        gold: ['#FFD700', '#FFA500'],
    },

    // Legacy light mode (for future toggle)
    light: {
        background: '#F8F9FA',
        surface: '#FFFFFF',
        text: '#2D3436',
        textSecondary: '#636E72',
    }
};

export const spacing = {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
};

export const typography: { [key: string]: TextStyle } = {
    h1: { fontSize: 32, fontWeight: '700', color: colors.text },
    h2: { fontSize: 24, fontWeight: '600', color: colors.text },
    h3: { fontSize: 20, fontWeight: '600', color: colors.text },
    body: { fontSize: 16, fontWeight: '400', color: colors.text },
    bodySmall: { fontSize: 14, fontWeight: '400', color: colors.textSecondary },
    caption: { fontSize: 12, fontWeight: '400', color: colors.textSecondary },
    label: { fontSize: 10, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase', color: colors.textMuted },
};

export const layout = {
    borderRadius: 16,
    borderRadiusSmall: 12,
    borderRadiusLarge: 24,
    cardShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    glowShadow: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
};
