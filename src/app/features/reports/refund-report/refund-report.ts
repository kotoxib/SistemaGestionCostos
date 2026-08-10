import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RefundState } from '@interfaces/refund';
import { REFUND_SAMPLE_DATA } from '@features/financial-management/refund/refund.sample-data';
import { RefundService } from '@services/apis/refund.service';
import { PRIMENG_MODULES } from '@shared/components/primeng';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ReportRefundRow, ReportRefundState } from './refund-report.models';

interface FilterOption {
  label: string;
  value: string;
}

const STATE_LABELS: Record<RefundState, ReportRefundState> = {
  Generated: 'Generado',
  Processed: 'Procesado',
  Cancelled: 'Anulado',
};

function dmyToIso(value: string): string {
  const [day, month, year] = value.split('/');
  return `${year}-${month}-${day}`;
}

@Component({
  selector: 'app-refund-report',
  imports: [CommonModule, FormsModule, ...PRIMENG_MODULES],
  templateUrl: './refund-report.html',
  styleUrl: './refund-report.scss',
})
export class RefundReport implements OnInit {
  private readonly messageService = inject(MessageService);
  private readonly refundService = inject(RefundService);

  searchTerm = '';
  dateFrom: Date | null = null;
  dateTo: Date | null = null;
  selectedClient: string | null = null;
  selectedState: string | null = null;

  loading = signal(true);

  readonly stateOptions: FilterOption[] = [
    { label: 'Generado', value: 'Generado' },
    { label: 'Procesado', value: 'Procesado' },
    { label: 'Anulado', value: 'Anulado' },
  ];

  readonly refunds = signal<ReportRefundRow[]>([]);

  readonly clientOptions = computed<FilterOption[]>(() => {
    const names = [...new Set(this.refunds().map((r) => r.clientName))].sort();
    return names.map((name) => ({ label: name, value: name }));
  });

  readonly exportColumns = [
    { field: 'caseNumber', header: 'N° de Reembolso' },
    { field: 'clientName', header: 'Cliente' },
    { field: 'totalAmount', header: 'Monto Total' },
    { field: 'state', header: 'Estado' },
    { field: 'date', header: 'Fecha' },
  ];

  ngOnInit(): void {
    this.loadRefunds();
  }

  private loadRefunds(): void {
    this.loading.set(true);
    this.refundService
      .getAllRefundPagination({ pageSize: 1000, pageNumber: 1, sortType: 1 })
      .subscribe({
        next: (result) => {
          this.refunds.set(
            result.entities.map((row) => ({
              caseNumber: row.caseNumber,
              clientName: row.clientName,
              totalAmount: row.totalAmount,
              state: STATE_LABELS[row.state],
              date: row.date,
            })),
          );
          this.loading.set(false);
        },
        error: () => {
          this.refunds.set(
            REFUND_SAMPLE_DATA.map((row) => ({
              caseNumber: row.caseNumber,
              clientName: row.clientName,
              totalAmount: row.totalAmount,
              state: row.state,
              date: dmyToIso(row.date),
            })),
          );
          this.loading.set(false);
        },
      });
  }

  get filteredRefunds(): ReportRefundRow[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.refunds().filter((row) => {
      const matchesTerm =
        !term || row.caseNumber.toLowerCase().includes(term) || row.clientName.toLowerCase().includes(term);
      const matchesClient = !this.selectedClient || row.clientName === this.selectedClient;
      const matchesState = !this.selectedState || row.state === this.selectedState;
      const matchesDate = this.matchesDateRange(row.date);

      return matchesTerm && matchesClient && matchesState && matchesDate;
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
    const all = this.refunds();

    return {
      totalCount: all.length,
      totalAmount: all.reduce((sum, r) => sum + r.totalAmount, 0),
      processedAmount: all.filter((r) => r.state === 'Procesado').reduce((sum, r) => sum + r.totalAmount, 0),
      pendingCount: all.filter((r) => r.state === 'Generado').length,
    };
  });

  stateBadgeClass(state: ReportRefundRow['state']): string {
    if (state === 'Generado') return 'badge-active';
    if (state === 'Procesado') return 'badge-info';
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
