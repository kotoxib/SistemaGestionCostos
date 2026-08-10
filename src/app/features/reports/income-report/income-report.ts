import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CASE_INCOME_SAMPLE_DATA } from '@features/financial-management/case-income/case-income.sample-data';
import { CaseIncomeService } from '@services/apis/case-income.service';
import { CaseIncomeState } from '@interfaces/caseIncome';
import { PRIMENG_MODULES } from '@shared/components/primeng';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ReportIncomeRow, ReportIncomeState } from './income-report.models';

interface FilterOption {
  label: string;
  value: string;
}

const STATE_LABELS: Record<CaseIncomeState, ReportIncomeState> = {
  Paid: 'Pagado',
  InProgress: 'En proceso',
  NoPayments: 'Sin pagos',
};

function dmyToIso(value: string): string {
  const [day, month, year] = value.split('/');
  return `${year}-${month}-${day}`;
}

@Component({
  selector: 'app-income-report',
  imports: [CommonModule, FormsModule, ...PRIMENG_MODULES],
  templateUrl: './income-report.html',
  styleUrl: './income-report.scss',
})
export class IncomeReport implements OnInit {
  private readonly messageService = inject(MessageService);
  private readonly caseIncomeService = inject(CaseIncomeService);

  searchTerm = '';
  dateFrom: Date | null = null;
  dateTo: Date | null = null;
  selectedClient: string | null = null;
  selectedState: string | null = null;

  loading = signal(true);

  readonly stateOptions: FilterOption[] = [
    { label: 'Pagado', value: 'Pagado' },
    { label: 'En proceso', value: 'En proceso' },
    { label: 'Sin pagos', value: 'Sin pagos' },
  ];

  readonly incomes = signal<ReportIncomeRow[]>([]);

  readonly clientOptions = computed<FilterOption[]>(() => {
    const names = [...new Set(this.incomes().map((r) => r.clientName))].sort();
    return names.map((name) => ({ label: name, value: name }));
  });

  readonly exportColumns = [
    { field: 'incomeNumber', header: 'N° Ingreso' },
    { field: 'caseNumber', header: 'N° de Caso' },
    { field: 'clientName', header: 'Cliente' },
    { field: 'caseAmount', header: 'Monto Proyectado' },
    { field: 'paidAmount', header: 'Ingreso Real' },
    { field: 'balance', header: 'Saldo' },
    { field: 'paidPercentage', header: '% Real' },
    { field: 'state', header: 'Estado' },
    { field: 'lastPaymentDate', header: 'Último Pago' },
  ];

  ngOnInit(): void {
    this.loadIncomes();
  }

  private loadIncomes(): void {
    this.loading.set(true);
    this.caseIncomeService
      .getAllCaseIncomePagination({ pageSize: 1000, pageNumber: 1, sortType: 1 })
      .subscribe({
        next: (result) => {
          this.incomes.set(
            result.entities.map((row) => ({
              incomeNumber: row.incomeNumber,
              caseNumber: row.caseNumber,
              clientName: row.clientName,
              currency: row.currency,
              caseAmount: row.caseAmount,
              paidAmount: row.paidAmount,
              balance: row.balance,
              paidPercentage: row.paidPercentage,
              state: STATE_LABELS[row.state],
              lastPaymentDate: row.lastPaymentDate ?? null,
            })),
          );
          this.loading.set(false);
        },
        error: () => {
          this.incomes.set(
            CASE_INCOME_SAMPLE_DATA.map((row) => ({
              incomeNumber: row.incomeNumber,
              caseNumber: row.caseNumber,
              clientName: row.clientName,
              currency: row.currency,
              caseAmount: row.caseAmount,
              paidAmount: row.paidAmount,
              balance: row.balance,
              paidPercentage: row.paidPercentage,
              state: row.state,
              lastPaymentDate: row.lastPaymentDate ? dmyToIso(row.lastPaymentDate) : null,
            })),
          );
          this.loading.set(false);
        },
      });
  }

  get filteredIncomes(): ReportIncomeRow[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.incomes().filter((row) => {
      const matchesTerm =
        !term ||
        row.incomeNumber.toLowerCase().includes(term) ||
        row.caseNumber.toLowerCase().includes(term) ||
        row.clientName.toLowerCase().includes(term);
      const matchesClient = !this.selectedClient || row.clientName === this.selectedClient;
      const matchesState = !this.selectedState || row.state === this.selectedState;
      const matchesDate = this.matchesDateRange(row.lastPaymentDate);

      return matchesTerm && matchesClient && matchesState && matchesDate;
    });
  }

  private matchesDateRange(dateValue: string | null): boolean {
    if (!this.dateFrom && !this.dateTo) return true;
    if (!dateValue) return false;

    const rowDate = new Date(dateValue);
    if (Number.isNaN(rowDate.getTime())) return false;

    if (this.dateFrom && rowDate < this.startOfDay(this.dateFrom)) return false;
    if (this.dateTo && rowDate > this.endOfDay(this.dateTo)) return false;

    return true;
  }

  private startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
  }

  private endOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
  }

  readonly kpis = computed(() => {
    const all = this.incomes();

    return {
      totalCount: all.length,
      totalProjected: all.reduce((sum, r) => sum + r.caseAmount, 0),
      totalReal: all.reduce((sum, r) => sum + r.paidAmount, 0),
      totalBalance: all.reduce((sum, r) => sum + r.balance, 0),
    };
  });

  stateBadgeClass(state: ReportIncomeRow['state']): string {
    if (state === 'Pagado') return 'badge-active';
    if (state === 'En proceso') return 'badge-warn';
    return 'badge-inactive';
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.dateFrom = null;
    this.dateTo = null;
    this.selectedClient = null;
    this.selectedState = null;
  }

  exportReport(table: Table): void {
    table.exportCSV();
    this.messageService.add({ severity: 'success', summary: 'Reporte exportado en Excel', life: 3000 });
  }
}
