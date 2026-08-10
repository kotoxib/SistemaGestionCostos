import { EnvironmentProviders, inject, provideAppInitializer } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { filter } from 'rxjs';

import { EnvironmentStsConfigLoader } from './environment/environment-sts-config.loader';
import { buildOpenIdConfigurationFromEnv } from './environment/runtime-config';

const OAUTH_CALLBACK_PARAMS = ['code', 'state', 'session_state', 'iss'] as const;

function cleanOAuthCallbackParams(): void {
  const url = new URL(window.location.href);
  let changed = false;

  for (const param of OAUTH_CALLBACK_PARAMS) {
    if (!url.searchParams.has(param)) continue;
    url.searchParams.delete(param);
    changed = true;
  }

  if (!changed) return;

  window.history.replaceState(window.history.state, document.title, url.toString());
}

export function provideCoreAppInitializer(): EnvironmentProviders {
  return provideAppInitializer(() => {
    const environmentLoader = inject(EnvironmentStsConfigLoader);
    const oauthService = inject(OAuthService);

    return environmentLoader.loadEnvironment().then(async (env) => {
      oauthService.configure(buildOpenIdConfigurationFromEnv(env));
      await oauthService.loadDiscoveryDocumentAndTryLogin();
      cleanOAuthCallbackParams();

      oauthService.events.pipe(filter((e) => e.type === 'token_received')).subscribe(() => {
        cleanOAuthCallbackParams();
      });

      oauthService.events
        .pipe(filter((e) => e.type === 'token_refresh_error' || e.type === 'silent_refresh_error'))
        .subscribe(() => {
          oauthService.logOut();
        });

      oauthService.setupAutomaticSilentRefresh();
    });
  });
}
