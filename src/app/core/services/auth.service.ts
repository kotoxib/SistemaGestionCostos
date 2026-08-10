import { Injectable, inject } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly oauth = inject(OAuthService);

  redirectForLogin(): void {
    if (!this.oauth.hasValidAccessToken()) {
      this.oauth.initCodeFlow();
    }
  }

  logout(): void {
    this.oauth.logOut();
  }

  get isAuthenticated(): boolean {
    return this.oauth.hasValidAccessToken();
  }

  get identityClaims(): Record<string, unknown> | null {
    const claims = this.oauth.getIdentityClaims();
    return claims && typeof claims === 'object' ? (claims as Record<string, unknown>) : null;
  }
}
