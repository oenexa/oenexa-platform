import { describe, it, expect, beforeEach } from 'vitest';
import { oenexaSessionStore, buildOidcAuthorizeUrl } from './index';

describe('Auth SDK Package', () => {
  beforeEach(() => {
    oenexaSessionStore.clear();
  });

  it('manages authenticated session strictly in memory', () => {
    expect(oenexaSessionStore.isAuthenticated()).toBe(false);

    oenexaSessionStore.setSession('jwt-token-123', {
      sub: 'usr_001',
      email: 'trader@oenexa.com',
      roles: ['ROLE_TRADER'],
      kycTier: 'TIER2',
    });

    expect(oenexaSessionStore.isAuthenticated()).toBe(true);
    expect(oenexaSessionStore.getAccessToken()).toBe('jwt-token-123');
    expect(oenexaSessionStore.getUser().email).toBe('trader@oenexa.com');

    oenexaSessionStore.clear();
    expect(oenexaSessionStore.isAuthenticated()).toBe(false);
    expect(oenexaSessionStore.getAccessToken()).toBeNull();
  });

  it('builds canonical OIDC Authorization Code PKCE URL', () => {
    const url = buildOidcAuthorizeUrl({
      clientId: 'oenexa-portal-shell',
      redirectUri: 'https://app.oenexa.com/callback',
      state: 'state-xyz',
      codeChallenge: 'challenge-abc',
    });

    expect(url).toContain('https://identity.oenexa.com/oauth2/authorize');
    expect(url).toContain('client_id=oenexa-portal-shell');
    expect(url).toContain('code_challenge=challenge-abc');
    expect(url).toContain('code_challenge_method=S256');
  });
});
