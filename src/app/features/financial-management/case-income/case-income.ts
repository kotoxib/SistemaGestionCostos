import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, signal, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PRIMENG_MODULES } from '@shared/components/primeng';
import { MessageDialogService } from '@shared/components/message-dialog/message-dialog.service';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { NewIncomeDialog } from './dialog/new-income-dialog/new-income-dialog';
import { ViewIncomeDialog } from './dialog/view-income-dialog/view-income-dialog';
import { EditIncomeDialog } from './dialog/edit-income-dialog/edit-income-dialog';
import { CaseIncomeRow, CaseOption, IncomePayment } from './case-income.models';
import { CASE_INCOME_SAMPLE_DATA } from './case-income.sample-data';
import { SPL_CASE_CATALOG } from '@shared/data/spl-case-catalog.sample-data';

interface FilterOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-case-income',
  imports: [CommonModule, FormsModule, ...PRIMENG_MODULES],
  providers: [DialogService],
  templateUrl: './case-income.html',
  styleUrl: './case-income.scss',
})
export class CaseIncome implements OnDestroy {
  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);
  private readonly messageDialogService = inject(MessageDialogService);
  private dialogRef: DynamicDialogRef | null = null;

  searchTerm = '';
  registrationDate: Date | null = null;
  selectedState: string | null = null;

  readonly stateOptions: FilterOption[] = [
    { label: 'Pagado', value: 'Pagado' },
    { label: 'En proceso', value: 'En proceso' },
    { label: 'Sin pagos', value: 'Sin pagos' },
  ];

  readonly availableCases: CaseOption[] = SPL_CASE_CATALOG.map((c) => ({
    id: c.caseNumber,
    client: c.client,
    amount: c.amount,
    currency: c.currency,
  }));

  readonly incomes = signal<CaseIncomeRow[]>(structuredClone(CASE_INCOME_SAMPLE_DATA));

  get filteredIncomes(): CaseIncomeRow[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.incomes().filter((row) => {
      const matchesTerm =
        !term ||
        row.incomeNumber.toLowerCase().includes(term) ||
        row.caseNumber.toLowerCase().includes(term) ||
        row.clientName.toLowerCase().includes(term);

      const matchesState = !this.selectedState || row.state === this.selectedState;

      return matchesTerm && matchesState;
    });
  }

  progressColor(state: CaseIncomeRow['state']): string {
    if (state === 'Pagado') return '#22c55e';
    if (state === 'En proceso') return '#f59e0b';
    return '#ef4444';
  }

  stateBadgeClass(state: CaseIncomeRow['state']): string {
    if (state === 'Pagado') return 'badge-active';
    if (state === 'En proceso') return 'badge-warn';
    return 'badge-inactive';
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.registrationDate = null;
    this.selectedState = null;
  }

  openNewIncomeDialog(): void {
    this.dialogRef = this.openDialog(
      NewIncomeDialog,
      { cases: this.availableCases },
      'min(640px, calc(100vw - 32px))',
    );

    this.dialogRef?.onClose.subscribe((result?: { caseId: string }) => {
      if (!result) return;

      const selected = this.availableCases.find((c) => c.id === result.caseId);
      if (!selected) return;

      this.incomes.update((list) => [
        {
          id: list.length + 1,
          incomeNumber: `ING-2025-${String(list.length + 1).padStart(3, '0')}`,
          caseNumber: selected.id,
          clientName: selected.client,
          currency: selected.currency,
          caseAmount: selected.amount,
          paidAmount: 0,
          balance: selected.amount,
          paidPercentage: 0,
          state: 'Sin pagos',
          lastPaymentDate: null,
          responsible: 'Administrador',
          payments: [],
        },
        ...list,
      ]);

      this.showToast('Ingreso creado exitosamente');
    });
  }

  openViewIncomeDialog(row: CaseIncomeRow): void {
    this.dialogRef = this.openDialog(
      ViewIncomeDialog,
      { income: row },
      'min(640px, calc(100vw - 32px))',
    );
  }

  openEditIncomeDialog(row: CaseIncomeRow): void {
    this.dialogRef = this.openDialog(
      EditIncomeDialog,
      { income: row },
      'min(680px, calc(100vw - 32px))',
    );

    this.dialogRef?.onClose.subscribe((result?: { payments: IncomePayment[]; caseAmount: number }) => {
      if (!result) return;

      const paidAmount = result.payments.reduce((sum, p) => sum + p.amount, 0);
      const caseAmount = result.caseAmount;
      const balance = Math.max(caseAmount - paidAmount, 0);
      const paidPercentage = caseAmount > 0 ? Math.round((paidAmount / caseAmount) * 100) : 0;
      const state = paidPercentage >= 100 ? 'Pagado' : paidAmount > 0 ? 'En proceso' : 'Sin pagos';
      const lastPaymentDate = result.payments.at(-1)?.date ?? row.lastPaymentDate;

      this.incomes.update((list) =>
        list.map((item) =>
          item.id === row.id
            ? { ...item, payments: result.payments, caseAmount, paidAmount, balance, paidPercentage, state, lastPaymentDate }
            : item,
        ),
      );

      this.showToast('Ingreso actualizado exitosamente');
    });
  }

  async openDeleteConfirm(row: CaseIncomeRow): Promise<void> {
    const result = await this.messageDialogService.confirmWarning(
      '¿Eliminar ingreso?',
      `Estás a punto de eliminar el ingreso ${row.incomeNumber}. Esta acción no se puede deshacer.`,
    );

    if (!result.confirmed) return;

    this.incomes.update((list) => list.filter((item) => item.id !== row.id));

    this.showToast('Ingreso eliminado exitosamente');
  }

  private openDialog(component: Type<unknown>, data: unknown, width: string): DynamicDialogRef | null {
    return this.dialogService.open(component, {
      showHeader: false,
      modal: true,
      dismissableMask: true,
      closeOnEscape: true,
      width,
      data,
      contentStyle: {
        padding: '0',
        borderRadius: '18px',
        overflow: 'hidden',
      },
      style: {
        borderRadius: '18px',
        overflow: 'hidden',
        boxShadow: '0 28px 70px rgba(15, 23, 42, 0.32)',
      },
      breakpoints: {
        '640px': 'calc(100vw - 22px)',
      },
    });
  }

  private showToast(summary: string): void {
    this.messageService.add({ severity: 'success', summary, life: 3000 });
  }

  ngOnDestroy(): void {
    this.dialogRef?.close();
  }
}
