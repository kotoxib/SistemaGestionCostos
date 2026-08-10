import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import Aura from '@primeuix/themes/aura';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { provideCore } from '@core/core.provider';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    ...provideCore(),
    provideCharts(withDefaultRegisterables()),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.sigone-dark',
        },
      },
    }),
    MessageService,
  ],
};
