/**
 * Tailwind CSS Preset mapping OENEXA design tokens to utility classes.
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        ox: {
          canvas: 'var(--ox-bg-canvas)',
          surface: 'var(--ox-bg-surface)',
          elevated: 'var(--ox-bg-elevated)',
          hover: 'var(--ox-bg-hover)',
          border: 'var(--ox-border-subtle)',
          'border-strong': 'var(--ox-border-strong)',
          primary: 'var(--ox-accent-primary)',
          cyan: 'var(--ox-accent-cyan)',
          positive: 'var(--ox-accent-positive)',
          warning: 'var(--ox-accent-warning)',
          danger: 'var(--ox-accent-danger)',
        },
      },
      textColor: {
        'ox-primary': 'var(--ox-text-primary)',
        'ox-secondary': 'var(--ox-text-secondary)',
        'ox-muted': 'var(--ox-text-muted)',
      },
      fontFamily: {
        sans: ['var(--ox-font-sans)'],
        mono: ['var(--ox-font-mono)'],
      },
    },
  },
};
