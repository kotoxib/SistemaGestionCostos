import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

import { EnvironmentStateService } from '@core/environment/environment-state.service';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  let apiBase: string;
  try {
    apiBase = inject(EnvironmentStateService).getAppEnvironment().scgApiUrl.replace(/\/+$/, '');
  } catch {
    return next(req);
  }

  const requestUrl = typeof req.url === 'string' ? req.url : '';
  if (!requestUrl || !requestUrl.startsWith(apiBase)) {
    return next(req);
  }

  if (req.headers.has('Authorization')) {
    return next(req);
  }

  const token = inject(OAuthService).getAccessToken();
  if (!token) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );
};
