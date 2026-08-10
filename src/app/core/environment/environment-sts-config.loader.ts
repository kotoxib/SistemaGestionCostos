import { HttpBackend, HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AppConst } from '../constants/app.const';
import { EnvironmentStateService } from './environment-state.service';
import { type AppEnvironment, parseAppEnvironment } from './runtime-config';

@Injectable({ providedIn: 'root' })
export class EnvironmentStsConfigLoader {
  private readonly httpBackend = inject(HttpBackend);
  private readonly environmentState = inject(EnvironmentStateService);

  loadEnvironment(): Promise<AppEnvironment> {
    const http = new HttpClient(this.httpBackend);
    const url = new URL(AppConst.PathEnvironment, document.baseURI).toString();
    return firstValueFrom(http.get<unknown>(url)).then((json) => {
      const env = parseAppEnvironment(json);
      this.environmentState.setAppEnvironment(env);
      return env;
    });
  }
}
