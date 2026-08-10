import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PRIMENG_MODULES } from '@shared/components/primeng';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

type CaseCommissionState = 'Pendiente' | 'Adelantado' | 'Pagado';
type AttorneyState = 'Pendiente' | 'Parcial' | 'Pagado';

interface CommissionCaseRecord {
  caseNumber: string;
  attorney: string;
  commissionAmount: number;
  advancesTotal: number;
  balance: number;
  state: CaseCommissionState;
  year: number;
  month: number;
}

interface AttorneySummary {
  id: string;
  attorney: string;
  totalCommission: number;
  disbursed: number;
  balance: number;
  state: AttorneyState;
}

interface FilterOption {
  label: string;
  value: string;
}

interface ProgressMetric {
  label: string;
  value: string;
  percentage: number;
  tone: 'green' | 'orange';
}

const ATTORNEY_IDS: Record<string, string> = {
  'M. Rodríguez': 'com-001',
  'C. Pérez': 'com-002',
  'A. López': 'com-003',
  'J. García': 'com-004',
  'R. Fernández': 'com-005',
};

@Component({
  selector: 'app-commissions-dashboard',
  imports: [CommonModule, FormsModule, RouterLink, BaseChartDirective, ...PRIMENG_MODULES],
  templateUrl: './commissions-dashboard.html',
  styleUrl: './commissions-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommissionsDashboard {
  readonly selectedYear = signal<string | null>(null);
  readonly selectedMonth = signal<string | null>(null);
  readonly selectedAttorney = signal<string | null>(null);

  readonly yearOptions: FilterOption[] = [
    { label: '2021', value: '2021' },
    { label: '2022', value: '2022' },
    { label: '2023', value: '2023' },
    { label: '2024', value: '2024' },
    { label: '2025', value: '2025' },
  ];

  readonly monthOptions: FilterOption[] = [
    { label: 'Enero', value: '1' },
    { label: 'Febrero', value: '2' },
    { label: 'Marzo', value: '3' },
    { label: 'Abril', value: '4' },
    { label: 'Mayo', value: '5' },
    { label: 'Junio', value: '6' },
    { label: 'Julio', value: '7' },
    { label: 'Agosto', value: '8' },
    { label: 'Septiembre', value: '9' },
    { label: 'Octubre', value: '10' },
    { label: 'Noviembre', value: '11' },
    { label: 'Diciembre', value: '12' },
  ];

  readonly attorneyOptions: FilterOption[] = [
    { label: 'M. Rodríguez', value: 'M. Rodríguez' },
    { label: 'C. Pérez', value: 'C. Pérez' },
    { label: 'A. López', value: 'A. López' },
    { label: 'J. García', value: 'J. García' },
    { label: 'R. Fernández', value: 'R. Fernández' },
  ];

  readonly cases: CommissionCaseRecord[] = [
    { caseNumber: 'CJ-2021-0001', attorney: 'M. Rodríguez', commissionAmount: 12000, advancesTotal: 12000, balance: 0, state: 'Pagado', year: 2021, month: 2 },
    { caseNumber: 'CJ-2022-0001', attorney: 'C. Pérez', commissionAmount: 16000, advancesTotal: 8000, balance: 8000, state: 'Adelantado', year: 2022, month: 5 },
    { caseNumber: 'CJ-2023-0001', attorney: 'A. López', commissionAmount: 20000, advancesTotal: 20000, balance: 0, state: 'Pagado', year: 2023, month: 6 },
    { caseNumber: 'CJ-2024-0001', attorney: 'J. García', commissionAmount: 24000, advancesTotal: 10000, balance: 14000, state: 'Adelantado', year: 2024, month: 7 },
    { caseNumber: 'CJ-2025-0001', attorney: 'M. Rodríguez', commissionAmount: 9200, advancesTotal: 0, balance: 9200, state: 'Pendiente', year: 2025, month: 1 },
    { caseNumber: 'CJ-2025-0002', attorney: 'M. Rodríguez', commissionAmount: 6000, advancesTotal: 0, balance: 6000, state: 'Pendiente', year: 2025, month: 1 },
    { caseNumber: 'CJ-2025-0003', attorney: 'C. Pérez', commissionAmount: 14750.5, advancesTotal: 8000, balance: 6750.5, state: 'Adelantado', year: 2025, month: 2 },
    { caseNumber: 'CJ-2025-0004', attorney: 'C. Pérez', commissionAmount: 8000, advancesTotal: 4000, balance: 4000, state: 'Adelantado', year: 2025, month: 2 },
    { caseNumber: 'CJ-2025-0005', attorney: 'A. López', commissionAmount: 18900, advancesTotal: 18900, balance: 0, state: 'Pagado', year: 2025, month: 2 },
    { caseNumber: 'CJ-2025-0006', attorney: 'J. García', commissionAmount: 9800, advancesTotal: 0, balance: 9800, state: 'Pendiente', year: 2025, month: 2 },
    { caseNumber: 'CJ-2025-0007', attorney: 'R. Fernández', commissionAmount: 17400.75, advancesTotal: 10000, balance: 7400.75, state: 'Adelantado', year: 2025, month: 3 },
    { caseNumber: 'CJ-2025-0008', attorney: 'R. Fernández', commissionAmount: 10000, advancesTotal: 5000, balance: 5000, state: 'Adelantado', year: 2025, month: 3 },
  ];

  private matches(year: number, month: number, attorney: string): boolean {
    if (this.selectedYear() && String(year) !== this.selectedYear()) return false;
    if (this.selectedMonth() && String(month) !== this.selectedMonth()) return false;
    if (this.selectedAttorney() && attorney !== this.selectedAttorney()) return false;
    return true;
  }

  readonly filteredCases = computed<CommissionCaseRecord[]>(() =>
    this.cases.filter((r) => this.matches(r.year, r.month, r.attorney)),
  );

  readonly attorneys = computed<AttorneySummary[]>(() => {
    const byAttorney = new Map<string, CommissionCaseRecord[]>();

    for (const row of this.filteredCases()) {
      const group = byAttorney.get(row.attorney) ?? [];
      group.push(row);
      byAttorney.set(row.attorney, group);
    }

    return Array.from(byAttorney.entries()).map(([attorney, rows]) => {
      const totalCommission = rows.reduce((sum, r) => sum + r.commissionAmount, 0);
      const disbursed = rows.reduce((sum, r) => sum + r.advancesTotal, 0);
      const balance = rows.reduce((sum, r) => sum + r.balance, 0);
      const state: AttorneyState = balance === 0 ? 'Pagado' : disbursed > 0 ? 'Parcial' : 'Pendiente';

      return {
        id: ATTORNEY_IDS[attorney] ?? attorney,
        attorney,
        totalCommission,
        disbursed,
        balance,
        state,
      };
    });
  });

  readonly kpis = computed(() => {
    const attorneys = this.attorneys();
    const pendiente = attorneys.filter((a) => a.state === 'Pendiente').length;
    const parcial = attorneys.filter((a) => a.state === 'Parcial').length;
    const pagado = attorneys.filter((a) => a.state === 'Pagado').length;

    return {
      totalAttorneys: attorneys.length,
      pendiente,
      parcial,
      pagado,
      totalCommission: attorneys.reduce((sum, a) => sum + a.totalCommission, 0),
      totalDisbursed: attorneys.reduce((sum, a) => sum + a.disbursed, 0),
      totalBalance: attorneys.reduce((sum, a) => sum + a.balance, 0),
    };
  });

  readonly commissionStateChartData = computed<ChartData<'doughnut'>>(() => {
    const rows = this.filteredCases();

    return {
      labels: ['Pendiente', 'Adelantado', 'Pagado'],
      datasets: [
        {
          data: [
            rows.filter((r) => r.state === 'Pendiente').length,
            rows.filter((r) => r.state === 'Adelantado').length,
            rows.filter((r) => r.state === 'Pagado').length,
          ],
          backgroundColor: ['#D97706', '#F47920', '#22C55E'],
          hoverBackgroundColor: ['#D97706', '#F47920', '#22C55E'],
          borderWidth: 0,
        },
      ],
    };
  });

  readonly commissionStateChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#111827',
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (context) => `${context.label}: ${Number(context.parsed).toLocaleString('es-PE')}`,
        },
      },
    },
  };

  private readonly monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  private byAttorney(rows: CommissionCaseRecord[]): CommissionCaseRecord[] {
    return this.selectedAttorney() ? rows.filter((r) => r.attorney === this.selectedAttorney()) : rows;
  }

  readonly vsChartAxisLabel = computed(() =>
    this.selectedYear() ? `Año ${this.selectedYear()} — eje X: mes` : 'Sin filtro — eje X: año',
  );

  readonly generatedVsDisbursedChartData = computed<ChartData<'line'>>(() => {
    const rows = this.byAttorney(this.cases);
    const selectedYear = this.selectedYear();

    if (selectedYear) {
      const year = Number(selectedYear);
      const labels = this.monthNames;
      const generated = labels.map((_, i) =>
        rows.filter((r) => r.year === year && r.month === i + 1).reduce((sum, r) => sum + r.commissionAmount, 0),
      );
      const disbursed = labels.map((_, i) =>
        rows.filter((r) => r.year === year && r.month === i + 1).reduce((sum, r) => sum + r.advancesTotal, 0),
      );

      return this.buildVsLineData(labels, generated, disbursed);
    }

    const years = Array.from(new Set(rows.map((r) => r.year))).sort();
    const yearList = years.length ? years : this.yearOptions.map((o) => Number(o.value));
    const labels = yearList.map(String);
    const generated = yearList.map((y) => rows.filter((r) => r.year === y).reduce((sum, r) => sum + r.commissionAmount, 0));
    const disbursed = yearList.map((y) => rows.filter((r) => r.year === y).reduce((sum, r) => sum + r.advancesTotal, 0));

    return this.buildVsLineData(labels, generated, disbursed);
  });

  private buildVsLineData(labels: string[], generated: number[], disbursed: number[]): ChartData<'line'> {
    return {
      labels,
      datasets: [
        {
          label: 'Generada',
          data: generated,
          borderColor: '#4B5563',
          backgroundColor: 'rgba(75, 85, 99, 0.1)',
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#4B5563',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 5,
        },
        {
          label: 'Desembolsada',
          data: disbursed,
          borderColor: '#F47920',
          backgroundColor: 'rgba(244, 121, 32, 0.08)',
          fill: false,
          tension: 0.35,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#F47920',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 5,
        },
      ],
    };
  }

  readonly generatedVsDisbursedChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#111827',
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (context) => `${context.dataset.label}: S/ ${Number(context.parsed.y).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: '#9CA3AF', font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#9CA3AF', font: { size: 11 } },
        grid: { color: '#E5E7EB' },
        border: { display: false },
      },
    },
  };

  readonly progressMetrics = computed<ProgressMetric[]>(() => {
    const attorneys = this.attorneys();
    const total = attorneys.length;
    const liquidados = attorneys.filter((a) => a.state === 'Pagado').length;
    const pendientes = total - liquidados;

    return [
      { label: 'Abogados Liquidados', value: String(liquidados), percentage: total ? Math.round((liquidados / total) * 100) : 0, tone: 'green' },
      { label: 'Pendientes de Pago', value: String(pendientes), percentage: total ? Math.round((pendientes / total) * 100) : 0, tone: 'orange' },
    ];
  });

  getStateClass(state: AttorneyState): string {
    if (state === 'Pagado') return 'state-paid';
    if (state === 'Parcial') return 'state-partial';
    return 'state-pending';
  }

  clearFilters(): void {
    this.selectedYear.set(null);
    this.selectedMonth.set(null);
    this.selectedAttorney.set(null);
  }
}
