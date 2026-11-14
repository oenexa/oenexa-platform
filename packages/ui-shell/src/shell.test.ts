import { describe, it, expect } from 'vitest';
import { CANONICAL_ECOSYSTEM_NAV } from './index';

describe('CANONICAL_ECOSYSTEM_NAV', () => {
  it('contains all 10 canonical products with valid routes', () => {
    expect(CANONICAL_ECOSYSTEM_NAV).toHaveLength(10);
    const ids = CANONICAL_ECOSYSTEM_NAV.map((item) => item.id);
    expect(ids).toContain('portal');
    expect(ids).toContain('exchange');
    expect(ids).toContain('wallet');
    expect(ids).toContain('pay');
    expect(ids).toContain('chain');
    expect(ids).toContain('ai');
    expect(ids).toContain('oengo');
    expect(ids).toContain('security');
    expect(ids).toContain('admin');
    expect(ids).toContain('docs');
  });

  it('guarantees every item has canonicalUrl starting with https://', () => {
    CANONICAL_ECOSYSTEM_NAV.forEach((item) => {
      expect(item.canonicalUrl.startsWith('https://')).toBe(true);
      expect(item.path.startsWith('/')).toBe(true);
    });
  });
});
