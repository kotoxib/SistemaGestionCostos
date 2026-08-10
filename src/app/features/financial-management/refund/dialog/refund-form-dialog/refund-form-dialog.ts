import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DefendantStore } from '@features/financial-management/defendant/defendant.store';
import { FeeRequestStore } from '@features/financial-management/fee-request/fee-request.store';
import { PRIMENG_MODULES } from '@shared/components/primeng';
import { SPL_CASE_CATALOG } from '@shared/data/spl-case-catalog.sample-data';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RefundExpenseRow, RefundRow } from '../../refund.models';

export type RefundFormMode = 'create' | 'edit';

export interface RefundFormResult {
  caseNumber: string;
  clientName: string;
  defendantName?: string;
  templateFileName?: string;
  expenses: RefundExpenseRow[];
}

@Component({
  selector: 'app-refund-form-dialog',
  imports: [CommonModule, FormsModule, ...PRIMENG_MODULES],
  templateUrl: './refund-form-dialog.html',
  styleUrl: './refund-form-dialog.scss',
})
export class RefundFormDialog {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);
  private readonly feeRequestStore = inject(FeeRequestStore);
  private readonly defendantStore = inject(DefendantStore);

  private readonly row = this.config.data.row as RefundRow | undefined;

  readonly mode = this.config.data.mode as RefundFormMode;
  readonly isEdit = this.mode === 'edit';

  readonly caseOptions = SPL_CASE_CATALOG.map((c) => ({ label: `${c.caseNumber} — ${c.client}`, value: c.caseNumber }));

  readonly selectedCaseNumber = signal(this.row?.caseNumber ?? '');
  readonly selectedIds = signal<string[]>(this.row?.expenses.map((e) => e.id) ?? []);

  readonly selectedCase = computed(() => SPL_CASE_CATALOG.find((c) => c.caseNumber === this.selectedCaseNumber()) ?? null);
  readonly clientName = computed(() => this.selectedCase()?.client ?? this.row?.clientName ?? '');

  readonly demandado = computed(() => this.defendantStore.primaryDefendantFor(this.clientName()));

  readonly availableExpenses = computed<RefundExpenseRow[]>(() =>
    this.feeRequestStore.reimbursableByCase(this.selectedCaseNumber()).map((r) => ({
      id: String(r.id),
      feeRequestId: r.id,
      requestCode: r.code,
      defendant: r.defendant ?? this.demandado()?.fullName ?? '—',
      fileNumber: r.fileNumber ?? '—',
      concept: r.concept,
      expenseType: r.expenseType,
      amount: r.amount,
    })),
  );

  readonly selectedExpenses = computed(() =>
    this.availableExpenses().filter((e) => this.selectedIds().includes(e.id)),
  );

  readonly total = computed(() => this.selectedExpenses().reduce((sum, e) => sum + e.amount, 0));

  readonly allSelected = computed(
    () => this.availableExpenses().length > 0 && this.selectedIds().length === this.availableExpenses().length,
  );

  onCaseChange(caseNumber: string): void {
    this.selectedCaseNumber.set(caseNumber);
    this.selectedIds.set([]);
  }

  toggleExpense(id: string): void {
    this.selectedIds.update((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  }

  toggleAll(): void {
    const all = this.availableExpenses().map((e) => e.id);
    this.selectedIds.set(this.allSelected() ? [] : all);
  }

  get canSave(): boolean {
    return !!this.selectedCaseNumber() && this.selectedIds().length > 0;
  }

  close(): void {
    this.ref.close();
  }

  save(): void {
    if (!this.canSave) return;

    this.ref.close({
      caseNumber: this.selectedCaseNumber(),
      clientName: this.clientName(),
      defendantName: this.demandado()?.fullName,
      templateFileName: this.demandado()?.refundTemplate,
      expenses: this.selectedExpenses(),
    } satisfies RefundFormResult);
  }
}
