import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeeRequestExpenseType, FeeRequestState } from '@interfaces/feeRequest';
import { FEE_REQUEST_SAMPLE_DATA } from '@features/financial-management/fee-request/fee-request.sample-data';
import { FeeRequestService } from '@services/apis/fee-request.service';
import { PRIMENG_MODULES } from '@shared/components/primeng';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ReportExpenseType, ReportFeeRow, ReportFeeState } from './fee-report.models';

interface FilterOption {
  label: string;
  value: string;
}

const STATE_LABELS: Record<FeeRequestState, ReportFeeState> = {
  Registered: 'Registrado',
  Paid: 'Pagado',
  Refunded: 'Reembolsado',
  Completed: 'Concluído',
};

const EXPENSE_TYPE_LABELS: Record<FeeRequestExpenseType, ReportExpenseType> = {
  Judicial: 'Judicial',
  Administrative: 'Administrativo',
};

function dmyToIso(value: string): string {
  const [day, month, year] = value.split('/');
  return `${year}-${month}-${day}`;
}

@Component({
  selector: 'app-fee-report',
  imports: [CommonModule, FormsModule, ...PRIMENG_MODULES],
  templateUrl: './fee-report.html',
  styleUrl: './fee-report.scss',
})
export class FeeReport implements OnInit {
  private readonly messageService = inject(MessageService);
  private readonly feeRequestService = inject(FeeRequestService);

  searchTerm = '';
  dateFrom: Date | null = null;
  dateTo: Date | null = null;
  selectedClient: string | null = null;
  selectedExpenseType: string | null = null;
  selectedState: string | null = null;

  loading = signal(true);

  readonly expenseTypeOptions: FilterOption[] = [
    { label: 'Judicial', value: 'Judicial' },
    { label: 'Administrativo', value: 'Administrativo' },
  ];

  readonly stateOptions: FilterOption[] = [
    { label: 'Registrado', value: 'Registrado' },
    { label: 'Pagado', value: 'Pagado' },
    { label: 'Reembolsado', value: 'Reembolsado' },
    { label: 'Concluído', value: 'Concluído' },
  ];

  readonly fees = signal<ReportFeeRow[]>([]);

  readonly clientOptions = computed<FilterOption[]>(() => {
    const names = [...new Set(this.fees().map((r) => r.clientName))].sort();
    return names.map((name) => ({ label: name, value: name }));
  });

  readonly exportColumns = [
    { field: 'code', header: 'Código' },
    { field: 'date', header: 'Fecha' },
    { field: 'clientName', header: 'Cliente' },
    { field: 'caseNumber', header: 'N° de Caso' },
    { field: 'expenseType', header: 'Tipo de Gasto' },
    { field: 'expenseName', header: 'Nombre del Gasto' },
    { field: 'amount', header: 'Importe S/' },
    { field: 'state', header: 'Estado' },
  ];

  ngOnInit(): void {
    this.loadFees();
  }

  private loadFees(): void {
    this.loading.set(true);
    this.feeRequestService
      .getAllFeeRequestPagination({ pageSize: 1000, pageNumber: 1, sortType: 1 })
      .subscribe({
        next: (result) => {
          this.fees.set(
            result.entities.map((row) => ({
              code: row.code,
              date: row.date,
              clientName: row.entity,
              caseNumber: row.caseNumber,
              expenseType: EXPENSE_TYPE_LABELS[row.expenseType],
              expenseName: row.expenseName,
              amount: row.amount,
              state: STATE_LABELS[row.state],
            })),
          );
          this.loading.set(false);
        },
        error: () => {
          this.fees.set(
            FEE_REQUEST_SAMPLE_DATA.map((row) => ({
              code: row.code,
              date: dmyToIso(row.date),
              clientName: row.clientName,
              caseNumber: row.caseNumber,
              expenseType: row.expenseType,
              expenseName: row.expenseName,
              amount: row.amount,
              state: row.state,
            })),
          );
          this.loading.set(false);
        },
      });
  }

  get filteredFees(): ReportFeeRow[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.fees().filter((row) => {
      const matchesTerm =
        !term ||
        row.code.toLowerCase().includes(term) ||
        row.caseNumber.toLowerCase().includes(term) ||
        row.expenseName.toLowerCase().includes(term);
      const matchesClient = !this.selectedClient || row.clientName === this.selectedClient;
      const matchesType = !this.selectedExpenseType || row.expenseType === this.selectedExpenseType;
      const matchesState = !this.selectedState || row.state === this.selectedState;
      const matchesDate = this.matchesDateRange(row.date);

      return matchesTerm && matchesClient && matchesType && matchesState && matchesDate;
    });
  }

  private matchesDateRange(dateValue: string): boolean {
    if (!this.dateFrom && !this.dateTo) return true;

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
    const all = this.fees();

    return {
      totalCount: all.length,
      totalAmount: all.reduce((sum, r) => sum + r.amount, 0),
      refundedAmount: all.filter((r) => r.state === 'Reembolsado').reduce((sum, r) => sum + r.amount, 0),
      pendingCount: all.filter((r) => r.state === 'Registrado').length,
    };
  });

  stateBadgeClass(state: ReportFeeRow['state']): string {
    if (state === 'Pagado') return 'badge-active';
    if (state === 'Registrado') return 'badge-info';
    if (state === 'Reembolsado') return 'badge-purple';
    return 'badge-inactive';
  }

  expenseTypeBadgeClass(type: ReportFeeRow['expenseType']): string {
    return type === 'Judicial' ? 'badge-info' : 'badge-inactive';
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.dateFrom = null;
    this.dateTo = null;
    this.selectedClient = null;
    this.selectedExpenseType = null;
    this.selectedState = null;
  }

  exportReport(table: Table): void {
    table.exportCSV();
    this.messageService.add({ severity: 'success', summary: 'Reporte exportado en Excel', life: 3000 });
  }
}
