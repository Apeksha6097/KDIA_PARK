export const COLORS = {
    primary: '#0d9488', // KDIA Teal
    primaryDark: '#0f766e',
    primaryLight: '#ccfbf1',
    secondary: '#0f172a', // Slate 900
    background: '#f8f9fa',
    card: '#ffffff',
    text: '#1e293b', // Slightly lighter slate for better reading
    textSecondary: '#64748b',
    textLight: '#94a3b8',
    border: '#e2e8f0',
    success: '#10b981',
    successBg: '#d1fae5',
    warning: '#f59e0b',
    warningBg: '#fef3c7',
    error: '#ef4444',
    errorBg: '#fee2e2',
    white: '#ffffff',
    black: '#000000',
    transparent: 'transparent',
};

export const SPACING = {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 40,
};

export const SHADOWS = {
    small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04, // Softer shadow
        shadowRadius: 2,
        elevation: 1,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06, // Softer shadow
        shadowRadius: 6,
        elevation: 3,
    },
    large: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08, // Softer shadow
        shadowRadius: 20,
        elevation: 6,
    },
};

export const FONTS = {
    // Reduced sizes for premium feel
    h1: { fontSize: 24, fontWeight: '700' as '700', letterSpacing: -0.5, color: COLORS.text },
    h2: { fontSize: 20, fontWeight: '600' as '600', letterSpacing: -0.5, color: COLORS.text },
    h3: { fontSize: 16, fontWeight: '600' as '600', color: COLORS.text },
    body: { fontSize: 14, fontWeight: '400' as '400', color: COLORS.textSecondary, lineHeight: 22 },
    bodySmall: { fontSize: 12, fontWeight: '400' as '400', color: COLORS.textSecondary },
    label: { fontSize: 12, fontWeight: '600' as '600', color: COLORS.textSecondary, letterSpacing: 0.5, textTransform: 'uppercase' as 'uppercase' },
    button: { fontSize: 15, fontWeight: '600' as '600', color: COLORS.white },
};
