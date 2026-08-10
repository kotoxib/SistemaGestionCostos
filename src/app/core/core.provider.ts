import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { EnvironmentProviders, Provider } from '@angular/core';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { pendingRequestsInterceptor$ } from 'ng-http-loader';
import { provideNgProgressOptions } from 'ngx-progressbar';

import { provideCoreAppInitializer } from './app-initializer.provider';
import { authTokenInterceptor } from './interceptors/auth-token.interceptor';

export const provideCore = (): (EnvironmentProviders | Provider)[] => {
  return [
    provideHttpClient(
      withInterceptors([pendingRequestsInterceptor$, authTokenInterceptor]),
      withInterceptorsFromDi(),
    ),
    provideOAuthClient(),
    provideNgProgressOptions({
      min: 20,
      max: 1,
      speed: 200,
      trickleSpeed: 300,
      fadeOutSpeed: 50,
      relative: true,
      flat: true,
      spinner: false,
    }),
    provideCoreAppInitializer(),
  ];
};
