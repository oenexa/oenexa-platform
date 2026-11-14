import { describe, it, expect } from 'vitest';
import { OENEXA_TOKENS } from './index';

describe('Design Tokens Package', () => {
  it('exports authoritative CSS variable token mappings', () => {
    expect(OENEXA_TOKENS.colors.bgCanvas).toBe('var(--ox-bg-canvas)');
    expect(OENEXA_TOKENS.colors.accentPrimary).toBe('var(--ox-accent-primary)');
    expect(OENEXA_TOKENS.typography.fontSans).toBe('var(--ox-font-sans)');
  });
});
