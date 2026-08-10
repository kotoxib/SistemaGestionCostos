import { inject } from '@angular/core';
import { type CanActivateFn } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

export const authGuard: CanActivateFn = () => {
  const oauthService = inject(OAuthService);

  if (oauthService.hasValidAccessToken()) {
    return true;
  }

  const isAuthCallbackInProgress =
    window.location.search.includes('code=') && window.location.search.includes('state=');

  if (!isAuthCallbackInProgress) {
    oauthService.initCodeFlow();
  }

  return false;
};
