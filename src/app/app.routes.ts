import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadChildren: () => import('./apps-layout/pages.routes').then((r) => r.PAGES_ROUTES),
  },
];
