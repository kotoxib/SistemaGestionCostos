import { Injectable, signal } from '@angular/core';

import type { AppEnvironment } from './runtime-config';

@Injectable({ providedIn: 'root' })
export class EnvironmentStateService {
  private readonly env = signal<AppEnvironment | null>(null);

  setAppEnvironment(value: AppEnvironment): void {
    this.env.set(value);
  }

  getAppEnvironment(): AppEnvironment {
    const current = this.env();
    if (!current) {
      throw new Error('environment.json aún no se ha cargado (OIDC).');
    }
    return current;
  }
}
