import { CommonModule, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PRIMENG_MODULES } from '@shared/components/primeng';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

type ExpenseType = 'Judicial' | 'Administrativo';
type ExpenseState = 'Registrado' | 'Pagado' | 'Reembolsado' | 'Concluído';

interface ExpenseRequestRecord {
  code: string;
  attorney: string;
  expenseType: ExpenseType;
  amount: number;
  state: ExpenseState;
  year: number;
  month: number;
}

interface RefundRecord {
  code: string;
  attorney: string;
  expenseType: ExpenseType;
  amount: number;
  year: number;
  month: number;
}

interface LawsuitRecord {
  code: string;
  attorney: string;
  expenseType: ExpenseType;
  finalStateChecked: boolean;
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
  selector: 'app-fee-dashboard',
  imports: [CommonModule, FormsModule, NgClass, BaseChartDirective, ...PRIMENG_MODULES],
  templateUrl: './fee-dashboard.html',
  styleUrl: './fee-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeeDashboard {
  readonly selectedYear = signal<string | null>(null);
  readonly selectedMonth = signal<string | null>(null);
  readonly selectedAttorney = signal<string | null>(null);
  readonly selectedExpenseType = signal<string | null>(null);

  readonly yearOptions: FilterOption[] = [
    { label: '2022', value: '2022' },
    { label: '2023', value: '2023' },
    { label: '2024', value: '2024' },
    { label: '2025', value: '2025' },
    { label: '2026', value: '2026' },
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

  readonly expenseTypeOptions: FilterOption[] = [
    { label: 'Judicial', value: 'Judicial' },
    { label: 'Administrativo', value: 'Administrativo' },
  ];

  readonly expenseRequests: ExpenseRequestRecord[] = [
    { code: 'SGC-2022-0001', attorney: 'M. Rodríguez', expenseType: 'Judicial', amount: 250.0, state: 'Concluído', year: 2022, month: 3 },
    { code: 'SGC-2022-0002', attorney: 'C. Pérez', expenseType: 'Administrativo', amount: 90.0, state: 'Concluído', year: 2022, month: 8 },
    { code: 'SGC-2023-0001', attorney: 'A. López', expenseType: 'Judicial', amount: 310.0, state: 'Concluído', year: 2023, month: 4 },
    { code: 'SGC-2023-0002', attorney: 'J. García', expenseType: 'Administrativo', amount: 145.0, state: 'Concluído', year: 2023, month: 9 },
    { code: 'SGC-2024-0001', attorney: 'R. Fernández', expenseType: 'Judicial', amount: 400.0, state: 'Concluído', year: 2024, month: 5 },
    { code: 'SGC-2024-0002', attorney: 'M. Rodríguez', expenseType: 'Administrativo', amount: 175.0, state: 'Concluído', year: 2024, month: 10 },
    { code: 'SGC-2025-0001', attorney: 'M. Rodríguez', expenseType: 'Judicial', amount: 320.0, state: 'Reembolsado', year: 2025, month: 1 },
    { code: 'SGC-2025-0002', attorney: 'M. Rodríguez', expenseType: 'Judicial', amount: 215.5, state: 'Concluído', year: 2025, month: 1 },
    { code: 'SGC-2025-0003', attorney: 'C. Pérez', expenseType: 'Administrativo', amount: 120.0, state: 'Concluído', year: 2025, month: 1 },
    { code: 'SGC-2025-0004', attorney: 'C. Pérez', expenseType: 'Administrativo', amount: 85.0, state: 'Pagado', year: 2025, month: 1 },
    { code: 'SGC-2025-0009', attorney: 'J. García', expenseType: 'Administrativo', amount: 200.0, state: 'Registrado', year: 2025, month: 2 },
    { code: 'SGC-2026-0001', attorney: 'C. Pérez', expenseType: 'Judicial', amount: 260.0, state: 'Registrado', year: 2026, month: 2 },
  ];

  readonly refunds: RefundRecord[] = [
    { code: 'CJ-2022-0009', attorney: 'M. Rodríguez', expenseType: 'Judicial', amount: 210.0, year: 2022, month: 6 },
    { code: 'CJ-2023-0009', attorney: 'C. Pérez', expenseType: 'Administrativo', amount: 260.0, year: 2023, month: 7 },
    { code: 'CJ-2024-0009', attorney: 'A. López', expenseType: 'Judicial', amount: 300.0, year: 2024, month: 8 },
    { code: 'CJ-2025-0009', attorney: 'J. García', expenseType: 'Administrativo', amount: 180.0, year: 2025, month: 11 },
    { code: 'CJ-2025-0001', attorney: 'M. Rodríguez', expenseType: 'Judicial', amount: 320.0, year: 2026, month: 4 },
    { code: 'CJ-2025-0002', attorney: 'M. Rodríguez', expenseType: 'Judicial', amount: 215.5, year: 2026, month: 3 },
    { code: 'CJ-2025-0006', attorney: 'J. García', expenseType: 'Administrativo', amount: 150.0, year: 2026, month: 3 },
  ];

  readonly lawsuits: LawsuitRecord[] = [
    { code: 'SGC-2025-0001', attorney: 'M. Rodríguez', expenseType: 'Judicial', finalStateChecked: true, year: 2025, month: 1 },
    { code: 'SGC-2025-0002', attorney: 'M. Rodríguez', expenseType: 'Judicial', finalStateChecked: true, year: 2025, month: 1 },
    { code: 'SGC-2025-0003', attorney: 'C. Pérez', expenseType: 'Administrativo', finalStateChecked: true, year: 2025, month: 1 },
    { code: 'SGC-2025-0004', attorney: 'C. Pérez', expenseType: 'Administrativo', finalStateChecked: true, year: 2025, month: 1 },
    { code: 'SGC-2025-0006', attorney: 'J. García', expenseType: 'Administrativo', finalStateChecked: false, year: 2025, month: 1 },
    { code: 'SGC-2025-0009', attorney: 'J. García', expenseType: 'Administrativo', finalStateChecked: false, year: 2025, month: 2 },
  ];

  private matches(year: number, month: number, attorney: string, expenseType: ExpenseType): boolean {
    if (this.selectedYear() && String(year) !== this.selectedYear()) return false;
    if (this.selectedMonth() && String(month) !== this.selectedMonth()) return false;
    if (this.selectedAttorney() && attorney !== this.selectedAttorney()) return false;
    if (this.selectedExpenseType() && expenseType !== this.selectedExpenseType()) return false;
    return true;
  }

  readonly filteredExpenseRequests = computed<ExpenseRequestRecord[]>(() =>
    this.expenseRequests.filter((r) => this.matches(r.year, r.month, r.attorney, r.expenseType)),
  );

  readonly filteredRefunds = computed<RefundRecord[]>(() =>
    this.refunds.filter((r) => this.matches(r.year, r.month, r.attorney, r.expenseType)),
  );

  readonly filteredLawsuits = computed<LawsuitRecord[]>(() =>
    this.lawsuits.filter((r) => this.matches(r.year, r.month, r.attorney, r.expenseType)),
  );

  readonly totalExpenseRequests = computed(() => this.filteredExpenseRequests().length);

  readonly totalExpenses = computed(() => this.filteredExpenseRequests().reduce((sum, r) => sum + r.amount, 0));

  readonly totalRefundsAmount = computed(() => this.filteredRefunds().reduce((sum, r) => sum + r.amount, 0));

  readonly lawsuitPendingCount = computed(() => this.filteredLawsuits().filter((r) => !r.finalStateChecked).length);

  readonly feeRequestStateChartData = computed<ChartData<'doughnut'>>(() => {
    const rows = this.filteredExpenseRequests();

    return {
      labels: ['Registrado', 'Pagado', 'Reembolsado', 'Concluído'],
      datasets: [
        {
          data: [
            rows.filter((r) => r.state === 'Registrado').length,
            rows.filter((r) => r.state === 'Pagado').length,
            rows.filter((r) => r.state === 'Reembolsado').length,
            rows.filter((r) => r.state === 'Concluído').length,
          ],
          backgroundColor: ['#38BDF8', '#22C55E', '#8B5CF6', '#4B5563'],
          hoverBackgroundColor: ['#38BDF8', '#22C55E', '#8B5CF6', '#4B5563'],
          borderWidth: 0,
        },
      ],
    };
  });

  readonly feeRequestStateChartOptions: ChartConfiguration<'doughnut'>['options'] = {
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

  private byAttorneyAndType<T extends { attorney: string; expenseType: ExpenseType }>(rows: T[]): T[] {
    return rows.filter((r) => {
      if (this.selectedAttorney() && r.attorney !== this.selectedAttorney()) return false;
      if (this.selectedExpenseType() && r.expenseType !== this.selectedExpenseType()) return false;
      return true;
    });
  }

  readonly vsChartAxisLabel = computed(() =>
    this.selectedYear() ? `Año ${this.selectedYear()} — eje X: mes` : 'Sin filtro — eje X: año',
  );

  readonly expenseVsRefundChartData = computed<ChartData<'line'>>(() => {
    const expenseRows = this.byAttorneyAndType(this.expenseRequests);
    const refundRows = this.byAttorneyAndType(this.refunds);
    const selectedYear = this.selectedYear();

    if (selectedYear) {
      const year = Number(selectedYear);
      const labels = this.monthNames;
      const expenseData = labels.map((_, i) =>
        expenseRows.filter((r) => r.year === year && r.month === i + 1).reduce((sum, r) => sum + r.amount, 0),
      );
      const refundData = labels.map((_, i) =>
        refundRows.filter((r) => r.year === year && r.month === i + 1).reduce((sum, r) => sum + r.amount, 0),
      );

      return this.buildVsLineData(labels, expenseData, refundData);
    }

    const years = Array.from(new Set([...expenseRows.map((r) => r.year), ...refundRows.map((r) => r.year)])).sort();
    const yearList = years.length ? years : this.yearOptions.map((o) => Number(o.value));
    const labels = yearList.map(String);
    const expenseData = yearList.map((y) => expenseRows.filter((r) => r.year === y).reduce((sum, r) => sum + r.amount, 0));
    const refundData = yearList.map((y) => refundRows.filter((r) => r.year === y).reduce((sum, r) => sum + r.amount, 0));

    return this.buildVsLineData(labels, expenseData, refundData);
  });

  private buildVsLineData(labels: string[], expenseData: number[], refundData: number[]): ChartData<'line'> {
    return {
      labels,
      datasets: [
        {
          label: 'Gastos',
          data: expenseData,
          borderColor: '#F47920',
          backgroundColor: 'rgba(244, 121, 32, 0.12)',
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#F47920',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 5,
        },
        {
          label: 'Reembolsos',
          data: refundData,
          borderColor: '#8B5CF6',
          backgroundColor: 'rgba(139, 92, 246, 0.08)',
          fill: false,
          tension: 0.35,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#8B5CF6',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 5,
        },
      ],
    };
  }

  readonly expenseVsRefundChartOptions: ChartConfiguration<'line'>['options'] = {
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

  readonly lawsuitTotal = computed(() => this.filteredLawsuits().length);

  readonly progressMetrics = computed<ProgressMetric[]>(() => {
    const total = this.lawsuitTotal();
    const registered = this.filteredLawsuits().filter((r) => r.finalStateChecked).length;
    const pending = total - registered;

    return [
      { label: 'Demandas Registradas', value: String(registered), percentage: total ? Math.round((registered / total) * 100) : 0, tone: 'green' },
      { label: 'Demandas Pendientes', value: String(pending), percentage: total ? Math.round((pending / total) * 100) : 0, tone: 'orange' },
    ];
  });

  clearFilters(): void {
    this.selectedYear.set(null);
    this.selectedMonth.set(null);
    this.selectedAttorney.set(null);
    this.selectedExpenseType.set(null);
  }
}
