import { CommonModule, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PRIMENG_MODULES } from '@shared/components/primeng';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

type IncomeState = 'Pagado' | 'En proceso' | 'Sin pagos';

interface CaseIncomeRecord {
  caseNumber: string;
  attorney: string;
  caseAmount: number;
  paidAmount: number;
  state: IncomeState;
  year: number;
  month: number;
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

@Component({
  selector: 'app-income-dashboard',
  imports: [CommonModule, FormsModule, NgClass, BaseChartDirective, ...PRIMENG_MODULES],
  templateUrl: './income-dashboard.html',
  styleUrl: './income-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeDashboard {
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

  readonly incomes: CaseIncomeRecord[] = [
    { caseNumber: 'CJ-2021-0001', attorney: 'M. Rodríguez', caseAmount: 20000, paidAmount: 20000, state: 'Pagado', year: 2021, month: 2 },
    { caseNumber: 'CJ-2022-0001', attorney: 'C. Pérez', caseAmount: 30000, paidAmount: 15000, state: 'En proceso', year: 2022, month: 5 },
    { caseNumber: 'CJ-2023-0001', attorney: 'A. López', caseAmount: 40000, paidAmount: 40000, state: 'Pagado', year: 2023, month: 6 },
    { caseNumber: 'CJ-2024-0001', attorney: 'J. García', caseAmount: 50000, paidAmount: 20000, state: 'En proceso', year: 2024, month: 7 },
    { caseNumber: 'CJ-2025-0001', attorney: 'M. Rodríguez', caseAmount: 8500, paidAmount: 8500, state: 'Pagado', year: 2025, month: 1 },
    { caseNumber: 'CJ-2025-0002', attorney: 'M. Rodríguez', caseAmount: 12000, paidAmount: 6000, state: 'En proceso', year: 2025, month: 1 },
    { caseNumber: 'CJ-2025-0003', attorney: 'C. Pérez', caseAmount: 45000, paidAmount: 0, state: 'Sin pagos', year: 2025, month: 2 },
    { caseNumber: 'CJ-2025-0004', attorney: 'C. Pérez', caseAmount: 5200, paidAmount: 5200, state: 'Pagado', year: 2025, month: 2 },
    { caseNumber: 'CJ-2025-0005', attorney: 'A. López', caseAmount: 18000, paidAmount: 9000, state: 'En proceso', year: 2025, month: 3 },
  ];

  private matches(year: number, month: number, attorney: string): boolean {
    if (this.selectedYear() && String(year) !== this.selectedYear()) return false;
    if (this.selectedMonth() && String(month) !== this.selectedMonth()) return false;
    if (this.selectedAttorney() && attorney !== this.selectedAttorney()) return false;
    return true;
  }

  readonly filteredIncomes = computed<CaseIncomeRecord[]>(() =>
    this.incomes.filter((r) => this.matches(r.year, r.month, r.attorney)),
  );

  readonly incomeTotal = computed(() => this.filteredIncomes().length);

  readonly totalProjected = computed(() => this.filteredIncomes().reduce((sum, r) => sum + r.caseAmount, 0));

  readonly totalReal = computed(() => this.filteredIncomes().reduce((sum, r) => sum + r.paidAmount, 0));

  readonly totalBalance = computed(() => this.totalProjected() - this.totalReal());

  readonly incomeStateChartData = computed<ChartData<'doughnut'>>(() => {
    const rows = this.filteredIncomes();

    return {
      labels: ['Pagado', 'En proceso', 'Sin pagos'],
      datasets: [
        {
          data: [
            rows.filter((r) => r.state === 'Pagado').length,
            rows.filter((r) => r.state === 'En proceso').length,
            rows.filter((r) => r.state === 'Sin pagos').length,
          ],
          backgroundColor: ['#22C55E', '#F59E0B', '#EF4444'],
          hoverBackgroundColor: ['#22C55E', '#F59E0B', '#EF4444'],
          borderWidth: 0,
        },
      ],
    };
  });

  readonly incomeStateChartOptions: ChartConfiguration<'doughnut'>['options'] = {
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

  private byAttorney(rows: CaseIncomeRecord[]): CaseIncomeRecord[] {
    return this.selectedAttorney() ? rows.filter((r) => r.attorney === this.selectedAttorney()) : rows;
  }

  readonly vsChartAxisLabel = computed(() =>
    this.selectedYear() ? `Año ${this.selectedYear()} — eje X: mes` : 'Sin filtro — eje X: año',
  );

  readonly projectedVsRealChartData = computed<ChartData<'line'>>(() => {
    const rows = this.byAttorney(this.incomes);
    const selectedYear = this.selectedYear();

    if (selectedYear) {
      const year = Number(selectedYear);
      const labels = this.monthNames;
      const projected = labels.map((_, i) =>
        rows.filter((r) => r.year === year && r.month === i + 1).reduce((sum, r) => sum + r.caseAmount, 0),
      );
      const real = labels.map((_, i) =>
        rows.filter((r) => r.year === year && r.month === i + 1).reduce((sum, r) => sum + r.paidAmount, 0),
      );

      return this.buildVsLineData(labels, projected, real);
    }

    const years = Array.from(new Set(rows.map((r) => r.year))).sort();
    const yearList = years.length ? years : this.yearOptions.map((o) => Number(o.value));
    const labels = yearList.map(String);
    const projected = yearList.map((y) => rows.filter((r) => r.year === y).reduce((sum, r) => sum + r.caseAmount, 0));
    const real = yearList.map((y) => rows.filter((r) => r.year === y).reduce((sum, r) => sum + r.paidAmount, 0));

    return this.buildVsLineData(labels, projected, real);
  });

  private buildVsLineData(labels: string[], projected: number[], real: number[]): ChartData<'line'> {
    return {
      labels,
      datasets: [
        {
          label: 'Proyectado',
          data: projected,
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
          label: 'Real',
          data: real,
          borderColor: '#22C55E',
          backgroundColor: 'rgba(34, 197, 94, 0.08)',
          fill: false,
          tension: 0.35,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#22C55E',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 5,
        },
      ],
    };
  }

  readonly projectedVsRealChartOptions: ChartConfiguration<'line'>['options'] = {
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

  readonly caseTotal = computed(() => this.filteredIncomes().length);

  readonly progressMetrics = computed<ProgressMetric[]>(() => {
    const total = this.caseTotal();
    const complete = this.filteredIncomes().filter((r) => r.state === 'Pagado').length;
    const pending = total - complete;

    return [
      { label: 'Ingreso Completo', value: String(complete), percentage: total ? Math.round((complete / total) * 100) : 0, tone: 'green' },
      { label: 'Pendientes de Cobro', value: String(pending), percentage: total ? Math.round((pending / total) * 100) : 0, tone: 'orange' },
    ];
  });

  clearFilters(): void {
    this.selectedYear.set(null);
    this.selectedMonth.set(null);
    this.selectedAttorney.set(null);
  }
}
