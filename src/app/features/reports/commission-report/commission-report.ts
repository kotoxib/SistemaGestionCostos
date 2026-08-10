import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CaseCommissionState } from '@interfaces/processCommission';
import { PROCESS_COMMISSION_SAMPLE_DATA } from '@features/commissions/process-commission/process-commission.sample-data';
import { ProcessCommissionService } from '@services/apis/process-commission.service';
import { PRIMENG_MODULES } from '@shared/components/primeng';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ReportCommissionRow, ReportCommissionState } from './commission-report.models';

interface FilterOption {
  label: string;
  value: string;
}

const STATE_LABELS: Record<CaseCommissionState, ReportCommissionState> = {
  Pending: 'Pendiente',
  Advanced: 'Adelantado',
  Paid: 'Pagado',
};

@Component({
  selector: 'app-commission-report',
  imports: [CommonModule, FormsModule, ...PRIMENG_MODULES],
  templateUrl: './commission-report.html',
  styleUrl: './commission-report.scss',
})
export class CommissionReport implements OnInit {
  private readonly messageService = inject(MessageService);
  private readonly processCommissionService = inject(ProcessCommissionService);

  @ViewChild('dt') private table?: Table;

  searchTerm = '';
  selectedState: string | null = null;
  selectedAttorney: string | null = null;

  loading = signal(true);

  readonly stateOptions: FilterOption[] = [
    { label: 'Pendiente', value: 'Pendiente' },
    { label: 'Adelantado', value: 'Adelantado' },
    { label: 'Pagado', value: 'Pagado' },
  ];

  readonly commissions = signal<ReportCommissionRow[]>([]);

  readonly attorneyOptions = computed<FilterOption[]>(() => {
    const names = [...new Set(this.commissions().map((c) => c.responsibleAttorney))].sort();
    return names.map((name) => ({ label: name, value: name }));
  });

  readonly exportColumns = [
    { field: 'caseNumber', header: 'N° Caso' },
    { field: 'clientName', header: 'Cliente' },
    { field: 'responsibleAttorney', header: 'Abogado' },
    { field: 'commissionAmount', header: 'Comisión Total' },
    { field: 'advancesTotal', header: 'Adelantos' },
    { field: 'commissionBalance', header: 'Saldo' },
    { field: 'state', header: 'Estado' },
  ];

  ngOnInit(): void {
    this.loadCommissions();
  }

  private loadCommissions(): void {
    this.loading.set(true);
    this.processCommissionService
      .getAllProcessCommissionPagination({ pageSize: 1000, pageNumber: 1, sortType: 1 })
      .subscribe({
        next: (result) => {
          this.commissions.set(
            result.entities.map((row) => ({
              id: row.id,
              caseNumber: row.caseNumber,
              clientName: row.clientName,
              responsibleAttorney: row.responsibleAttorney,
              commissionAmount: row.commissionAmount,
              advancesTotal: row.advancesTotal,
              commissionBalance: row.commissionBalance,
              state: STATE_LABELS[row.state],
            })),
          );
          this.loading.set(false);
        },
        error: () => {
          this.commissions.set(
            PROCESS_COMMISSION_SAMPLE_DATA.map((row) => ({
              id: row.id,
              caseNumber: row.caseNumber,
              clientName: row.clientName,
              responsibleAttorney: row.responsibleAttorney,
              commissionAmount: row.commissionAmount,
              advancesTotal: row.advancesTotal,
              commissionBalance: row.commissionBalance,
              state: row.state,
            })),
          );
          this.loading.set(false);
        },
      });
  }

  get filteredCommissions(): ReportCommissionRow[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.commissions().filter((row) => {
      const matchesTerm =
        !term || row.caseNumber.toLowerCase().includes(term) || row.clientName.toLowerCase().includes(term);
      const matchesState = !this.selectedState || row.state === this.selectedState;
      const matchesAttorney = !this.selectedAttorney || row.responsibleAttorney === this.selectedAttorney;

      return matchesTerm && matchesState && matchesAttorney;
    });
  }

  get kpis() {
    const base = this.filteredCommissions;

    return {
      totalCases: base.length,
      totalCommission: base.reduce((sum, r) => sum + r.commissionAmount, 0),
      totalAdvances: base.reduce((sum, r) => sum + r.advancesTotal, 0),
      totalBalance: base.reduce((sum, r) => sum + r.commissionBalance, 0),
    };
  }

  stateBadgeClass(state: ReportCommissionRow['state']): string {
    if (state === 'Pagado') return 'badge-active';
    if (state === 'Adelantado') return 'badge-warn';
    return 'badge-pending';
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedState = null;
    this.selectedAttorney = null;
  }

  exportReport(): void {
    this.table?.exportCSV();
    this.messageService.add({ severity: 'success', summary: 'Reporte exportado en Excel', life: 3000 });
  }
}
