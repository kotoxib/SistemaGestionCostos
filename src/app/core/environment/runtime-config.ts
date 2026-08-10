import type { AuthConfig } from 'angular-oauth2-oidc';

export const ENV_IDENTITY_PROVIDER_URL_KEY = 'identityProviderUrl' as const;
export const ENV_SCG_API_URL_KEY = 'scgApiUrl' as const;

export interface AppEnvironment {
  identityProviderUrl: string;
  scgApiUrl: string;
}

const OIDC_APP_DEFAULTS = {
  clientId: 'ScgAngularClient',
  scope: 'openid profile email Sigone offline_access',
  timeoutFactor: 0.75,
} as const;

function requireNonEmptyString(
  json: Record<string, unknown>,
  key: string,
  options?: { stripTrailingSlash?: boolean },
): string {
  const value = json[key];
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`environment.json: "${key}" debe ser un string no vacío.`);
  }
  const trimmed = value.trim();
  if (options?.stripTrailingSlash === true) {
    return trimmed.replace(/\/+$/, '');
  }
  return trimmed;
}

export function parseAppEnvironment(json: unknown): AppEnvironment {
  if (!json || typeof json !== 'object' || Array.isArray(json)) {
    throw new Error('environment.json: la respuesta debe ser un objeto JSON.');
  }

  const record = json as Record<string, unknown>;
  return {
    identityProviderUrl: requireNonEmptyString(record, ENV_IDENTITY_PROVIDER_URL_KEY),
    scgApiUrl: requireNonEmptyString(record, ENV_SCG_API_URL_KEY, {
      stripTrailingSlash: true,
    }),
  };
}

export function buildOpenIdConfigurationFromEnv(env: AppEnvironment): AuthConfig {
  return {
    issuer: env.identityProviderUrl,
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    clientId: OIDC_APP_DEFAULTS.clientId,
    scope: OIDC_APP_DEFAULTS.scope,
    responseType: 'code',
    requireHttps: false,
    useSilentRefresh: false,
    timeoutFactor: OIDC_APP_DEFAULTS.timeoutFactor,
    strictDiscoveryDocumentValidation: false,
  };
}
