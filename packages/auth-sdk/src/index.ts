export interface OenexaSessionUser {
  sub: string | null;
  email: string | null;
  username: string | null;
  roles: string[];
  kycTier: string | null;
}

export class InMemorySessionStore {
  private accessToken: string | null = null;
  private user: OenexaSessionUser = {
    sub: null,
    email: null,
    username: null,
    roles: [],
    kycTier: null,
  };

  public setSession(token: string | null, user: Partial<OenexaSessionUser>): void {
    this.accessToken = token && token.trim().length > 0 ? token.trim() : null;
    this.user = {
      sub: user.sub ?? this.user.sub,
      email: user.email ?? null,
      username: user.username ?? (user.email ? user.email.split('@')[0] : null),
      roles: Array.isArray(user.roles) ? user.roles : ['ROLE_USER'],
      kycTier: user.kycTier ?? null,
    };
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public getUser(): OenexaSessionUser {
    return { ...this.user };
  }

  public isAuthenticated(): boolean {
    return Boolean(this.accessToken || this.user.email || this.user.sub);
  }

  public clear(): void {
    this.accessToken = null;
    this.user = {
      sub: null,
      email: null,
      username: null,
      roles: [],
      kycTier: null,
    };
  }
}

export const oenexaSessionStore = new InMemorySessionStore();

export interface OidcAuthorizeParams {
  clientId: string;
  redirectUri: string;
  scope?: string;
  state: string;
  codeChallenge: string;
  identityAuthorityUrl?: string;
}

export function buildOidcAuthorizeUrl(params: OidcAuthorizeParams): string {
  const base = params.identityAuthorityUrl || 'https://identity.oenexa.com';
  const url = new URL('/oauth2/authorize', base);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', params.clientId);
  url.searchParams.set('redirect_uri', params.redirectUri);
  url.searchParams.set('scope', params.scope || 'openid profile email');
  url.searchParams.set('state', params.state);
  url.searchParams.set('code_challenge', params.codeChallenge);
  url.searchParams.set('code_challenge_method', 'S256');
  return url.toString();
}
