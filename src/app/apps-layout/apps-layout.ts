import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { LoaderService } from '@services/components';
import { filter } from 'rxjs';

import { APP_NAVIGATION, HeaderNavigationItem } from './apps-navigation';

@Component({
  selector: 'app-apps-layout',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './apps-layout.html',
  styleUrl: './apps-layout.scss',
})
export class AppsLayout {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly loader = inject(LoaderService);

  readonly sidebarOpen = signal(true);
  readonly currentUrl = signal(this.router.url);
  readonly system = computed(() => APP_NAVIGATION);

  readonly activeHeaderMenu = computed<HeaderNavigationItem>(() => {
    const url = this.currentUrl().split('?')[0].split('#')[0];

    return (
      this.system().menus.find((menu) =>
        menu.children.some((child) => url === child.route || url.startsWith(`${child.route}/`)),
      ) ?? this.system().menus[0]
    );
  });

  readonly sidebarItems = computed(() => this.activeHeaderMenu().children);

  readonly displayName = computed(() => {
    const claims = this.authService.identityClaims;
    if (!claims) return '';
    const name = claims['name'] ?? claims['preferred_username'] ?? claims['email'];
    return typeof name === 'string' ? name : '';
  });

  constructor() {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((e) => this.currentUrl.set(e.urlAfterRedirects));
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  closeSidebarOnMobile(): void {
    if (window.innerWidth <= 980) {
      this.sidebarOpen.set(false);
    }
  }

  isHeaderMenuActive(menu: HeaderNavigationItem): boolean {
    const url = this.currentUrl().split('?')[0].split('#')[0];
    return menu.children.some((child) => url === child.route || url.startsWith(`${child.route}/`));
  }

  isSidebarItemActive(route: string): boolean {
    const url = this.currentUrl().split('?')[0].split('#')[0];
    return url === route || url.startsWith(`${route}/`);
  }

  logout(): void {
    this.loader.show();
    this.authService.logout();
  }
}
