export interface SidebarNavigationItem {
  label: string;
  route: string;
  icon?: string;
}

export interface HeaderNavigationItem {
  key: string;
  label: string;
  route: string;
  children: SidebarNavigationItem[];
}

export interface AppNavigation {
  title: string;
  shortTitle: string;
  menus: HeaderNavigationItem[];
}

export const APP_NAVIGATION: AppNavigation = {
  title: 'Sistema de Control de Gestión',
  shortTitle: 'SGC',
  menus: [
    {
      key: 'home',
      label: 'Inicio',
      route: '/fee-dashboard',
      children: [
        {
          label: 'Dashboard de Gastos',
          route: '/fee-dashboard',
          icon: 'pi pi-chart-bar',
        },
        {
          label: 'Dashboard de Ingresos',
          route: '/income-dashboard',
          icon: 'pi pi-money-bill',
        },
        {
          label: 'Dashboard de Comisiones',
          route: '/commissions-dashboard',
          icon: 'pi pi-wallet',
        },
      ],
    },
    {
      key: 'gestion-financiera',
      label: 'Gestión Financiera',
      route: '/income-management',
      children: [
        {
          label: 'Gestión de Ingresos',
          route: '/income-management',
          icon: 'pi pi-money-bill',
        },
        {
          label: 'Gestión de Gasto',
          route: '/expense-requests',
          icon: 'pi pi-file',
        },
        {
          label: 'Reembolso',
          route: '/refunds',
          icon: 'pi pi-reply',
        },
        {
          label: 'Demandados',
          route: '/defendants',
          icon: 'pi pi-users',
        },
      ],
    },
    {
      key: 'comisiones',
      label: 'Comisiones',
      route: '/commissions-management',
      children: [
        {
          label: 'Gestión de Comisiones',
          route: '/commissions-management',
          icon: 'pi pi-percentage',
        },
      ],
    },
    {
      key: 'reportes',
      label: 'Reportes',
      route: '/income-reports',
      children: [
        {
          label: 'Reporte de Ingresos',
          route: '/income-reports',
          icon: 'pi pi-money-bill',
        },
        {
          label: 'Reporte de Solicitudes de Gasto',
          route: '/fee-reports',
          icon: 'pi pi-chart-bar',
        },
        {
          label: 'Reporte de Reembolsos',
          route: '/refund-reports',
          icon: 'pi pi-reply',
        },
        {
          label: 'Reporte de Comisiones',
          route: '/commission-reports',
          icon: 'pi pi-percentage',
        },
      ],
    },
  ],
};
