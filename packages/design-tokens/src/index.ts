export const OENEXA_TOKENS = {
  colors: {
    bgCanvas: 'var(--ox-bg-canvas)',
    bgSurface: 'var(--ox-bg-surface)',
    bgElevated: 'var(--ox-bg-elevated)',
    borderSubtle: 'var(--ox-border-subtle)',
    textPrimary: 'var(--ox-text-primary)',
    textSecondary: 'var(--ox-text-secondary)',
    accentPrimary: 'var(--ox-accent-primary)',
    accentPositive: 'var(--ox-accent-positive)',
    accentDanger: 'var(--ox-accent-danger)',
  },
  typography: {
    fontSans: 'var(--ox-font-sans)',
    fontMono: 'var(--ox-font-mono)',
  },
} as const;

export type OenexaTheme = 'dark' | 'light';
