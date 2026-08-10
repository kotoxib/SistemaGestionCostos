import { Routes } from '@angular/router';

import { AppsLayout } from './apps-layout';

export const PAGES_ROUTES: Routes = [
  {
    path: '',
    component: AppsLayout,
    children: [
      { path: '', redirectTo: 'fee-dashboard', pathMatch: 'full' },

      // INICIO
      {
        path: 'fee-dashboard',
        loadComponent: () =>
          import('../features/home/fee-dashboard/fee-dashboard').then((m) => m.FeeDashboard),
        data: {
          title: 'Dashboard de Gastos',
          subtitle: 'Solicitudes de gasto por estado, gastos vs reembolsos y demandas registradas.',
        },
      },
      {
        path: 'income-dashboard',
        loadComponent: () =>
          import('../features/home/income-dashboard/income-dashboard').then(
            (m) => m.IncomeDashboard,
          ),
        data: {
          title: 'Dashboard de Ingresos',
          subtitle: 'Ingresos por estado, monto proyectado vs real y cobranza por caso.',
        },
      },
      {
        path: 'commissions-dashboard',
        loadComponent: () =>
          import('../features/home/commissions-dashboard/commissions-dashboard').then(
            (m) => m.CommissionsDashboard,
          ),
        data: {
          title: 'Dashboard de Comisiones',
          subtitle: 'Resumen de comisiones por abogado.',
        },
      },

      // GESTIÓN FINANCIERA
      {
        path: 'income-management',
        loadComponent: () =>
          import('../features/financial-management/case-income/case-income').then(
            (m) => m.CaseIncome,
          ),
        data: {
          title: 'Gestión de Ingresos',
          subtitle: 'Pagos y cobranza por caso judicial.',
        },
      },
      {
        path: 'expense-requests',
        loadComponent: () =>
          import('../features/financial-management/fee-request/fee-request').then(
            (m) => m.FeeRequest,
          ),
        data: {
          title: 'Gestión de Gasto',
          subtitle: 'Solicitudes de arancel administrativo y judicial.',
        },
      },
      {
        path: 'refunds',
        loadComponent: () =>
          import('../features/financial-management/refund/refund').then((m) => m.Refund),
        data: {
          title: 'Reembolso',
          subtitle: 'Reembolsos por caso y gastos judiciales asociados.',
        },
      },
      {
        path: 'defendants',
        loadComponent: () =>
          import('../features/financial-management/defendant/defendant').then((m) => m.Defendant),
        data: {
          title: 'Demandados',
          subtitle: 'Administración de demandados, co-demandados y garantes.',
        },
      },

      // COMISIONES
      {
        path: 'commissions-management',
        loadComponent: () =>
          import('../features/commissions/process-commission/process-commission').then(
            (m) => m.ProcessCommissionPage,
          ),
        data: {
          title: 'Gestión de Comisiones',
          subtitle: 'Comisiones por proceso, adelantos e historial de pagos al abogado responsable.',
        },
      },

      // REPORTES
      {
        path: 'income-reports',
        loadComponent: () =>
          import('../features/reports/income-report/income-report').then((m) => m.IncomeReport),
        data: {
          title: 'Reporte de Ingresos',
          subtitle: 'Reporte consolidado de ingresos y cobranza por caso.',
        },
      },
      {
        path: 'fee-reports',
        loadComponent: () =>
          import('../features/reports/fee-report/fee-report').then((m) => m.FeeReport),
        data: {
          title: 'Reporte de Solicitudes de Gasto',
          subtitle: 'Reporte consolidado de solicitudes de arancel judicial y administrativo.',
        },
      },
      {
        path: 'refund-reports',
        loadComponent: () =>
          import('../features/reports/refund-report/refund-report').then((m) => m.RefundReport),
        data: {
          title: 'Reporte de Reembolsos',
          subtitle: 'Reporte consolidado de reembolsos generados y procesados.',
        },
      },
      {
        path: 'commission-reports',
        loadComponent: () =>
          import('../features/reports/commission-report/commission-report').then(
            (m) => m.CommissionReport,
          ),
        data: {
          title: 'Reporte de Comisiones',
          subtitle: 'Reporte consolidado de comisiones por abogado.',
        },
      },
    ],
  },
];
