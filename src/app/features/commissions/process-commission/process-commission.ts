import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PRIMENG_MODULES } from '@shared/components/primeng';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import {
  RegisterPaymentDialog,
  RegisterPaymentResult,
} from './dialog/register-payment-dialog/register-payment-dialog';
import { ProcessPaymentHistoryDialog } from './dialog/process-payment-history-dialog/process-payment-history-dialog';
import { AttorneyHistoryDialog } from './dialog/attorney-history-dialog/attorney-history-dialog';
import { ProcessCommission } from './process-commission.models';
import { PROCESS_COMMISSION_SAMPLE_DATA } from './process-commission.sample-data';

interface FilterOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-process-commission',
  imports: [CommonModule, FormsModule, ...PRIMENG_MODULES],
  providers: [DialogService],
  templateUrl: './process-commission.html',
  styleUrl: './process-commission.scss',
})
export class ProcessCommissionPage implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);
  private dialogRef: DynamicDialogRef | null = null;

  searchTerm = '';
  selectedYear = new Date().getFullYear();
  dateFrom: Date | null = null;
  dateTo: Date | null = null;
  selectedState: string | null = null;
  selectedAttorney: string | null = null;

  readonly years = [2024, 2025, 2026];

  readonly stateOptions: FilterOption[] = [
    { label: 'Pendiente', value: 'Pendiente' },
    { label: 'Adelantado', value: 'Adelantado' },
    { label: 'Pagado', value: 'Pagado' },
  ];

  readonly processCommissions = signal<ProcessCommission[]>(structuredClone(PROCESS_COMMISSION_SAMPLE_DATA));

  readonly attorneyOptions = computed<FilterOption[]>(() => {
    const names = [...new Set(this.processCommissions().map((p) => p.responsibleAttorney))].sort();
    return names.map((name) => ({ label: name, value: name }));
  });

  constructor() {
    const caseNumber = this.route.snapshot.queryParamMap.get('caseNumber');
    if (caseNumber) {
      this.searchTerm = caseNumber;
    }
  }

  get filteredProcesses(): ProcessCommission[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.processCommissions().filter((row) => {
      const matchesTerm =
        !term ||
        row.responsibleAttorney.toLowerCase().includes(term) ||
        row.caseNumber.toLowerCase().includes(term) ||
        row.clientName.toLowerCase().includes(term);
      const matchesState = !this.selectedState || row.state === this.selectedState;
      const matchesAttorney = !this.selectedAttorney || row.responsibleAttorney === this.selectedAttorney;

      return matchesTerm && matchesState && matchesAttorney;
    });
  }

  profitBadge(type: ProcessCommission['profitType']): string {
    return type === 'Real' ? 'badge-active' : 'badge-amber';
  }

  caseStateBadge(state: ProcessCommission['state']): string {
    if (state === 'Pagado') return 'badge-active';
    if (state === 'Adelantado') return 'badge-warn';
    return 'badge-pending';
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.dateFrom = null;
    this.dateTo = null;
    this.selectedState = null;
    this.selectedAttorney = null;
  }

  viewCaseHistory(caseRow: ProcessCommission): void {
    if (caseRow.advances.length === 0) return;

    this.dialogService.open(ProcessPaymentHistoryDialog, {
      showHeader: false,
      modal: true,
      dismissableMask: true,
      closeOnEscape: true,
      width: 'min(680px, calc(100vw - 32px))',
      data: { caseRow },
      contentStyle: { padding: '0', borderRadius: '18px', overflow: 'hidden' },
      style: { borderRadius: '18px', overflow: 'hidden', boxShadow: '0 28px 70px rgba(15, 23, 42, 0.32)' },
      breakpoints: { '640px': 'calc(100vw - 22px)' },
    });
  }

  viewAttorneyHistory(attorney: string): void {
    const processes = this.processCommissions().filter((p) => p.responsibleAttorney === attorney);
    const hasHistory = processes.some((p) => p.advances.length > 0);
    if (!hasHistory) return;

    this.dialogService.open(AttorneyHistoryDialog, {
      showHeader: false,
      modal: true,
      dismissableMask: true,
      closeOnEscape: true,
      width: 'min(920px, calc(100vw - 32px))',
      data: { attorney, processes },
      contentStyle: { padding: '0', borderRadius: '18px', overflow: 'hidden' },
      style: { borderRadius: '18px', overflow: 'hidden', boxShadow: '0 28px 70px rgba(15, 23, 42, 0.32)' },
      breakpoints: { '640px': 'calc(100vw - 22px)' },
    });
  }

  openPaymentDialog(caseRow: ProcessCommission): void {
    if (caseRow.commissionBalance === 0) return;

    this.dialogRef = this.dialogService.open(RegisterPaymentDialog, {
      showHeader: false,
      modal: true,
      dismissableMask: true,
      closeOnEscape: true,
      width: 'min(480px, calc(100vw - 32px))',
      data: { caseRow },
      contentStyle: { padding: '0', borderRadius: '18px', overflow: 'hidden' },
      style: { borderRadius: '18px', overflow: 'hidden', boxShadow: '0 28px 70px rgba(15, 23, 42, 0.32)' },
      breakpoints: { '640px': 'calc(100vw - 22px)' },
    });

    this.dialogRef?.onClose.subscribe((result?: RegisterPaymentResult) => {
      if (!result) return;

      this.processCommissions.update((list) =>
        list.map((row) => {
          if (row.caseNumber !== caseRow.caseNumber) return row;

          const advances = [
            ...row.advances,
            {
              id: `ADV-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
              date: new Date().toLocaleDateString('es-PE'),
              amount: result.amount,
              type: result.type,
              state: 'Procesado' as const,
              comment: result.comment,
            },
          ];
          const advancesTotal = advances.reduce((sum, a) => sum + a.amount, 0);
          const commissionBalance = Math.max(row.commissionAmount - advancesTotal, 0);
          const state: ProcessCommission['state'] = commissionBalance === 0 ? 'Pagado' : 'Adelantado';

          return { ...row, advances, advancesTotal, commissionBalance, state };
        }),
      );

      this.showToast('Pago registrado exitosamente');
    });
  }

  private showToast(summary: string): void {
    this.messageService.add({ severity: 'success', summary, life: 3000 });
  }

  ngOnDestroy(): void {
    this.dialogRef?.close();
  }
}
