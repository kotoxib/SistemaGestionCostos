import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PRIMENG_MODULES } from '@shared/components/primeng';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CaseIncomeRow, IncomePayment } from '../../case-income.models';

@Component({
  selector: 'app-edit-income-dialog',
  imports: [CommonModule, FormsModule, ...PRIMENG_MODULES],
  templateUrl: './edit-income-dialog.html',
  styleUrl: './edit-income-dialog.scss',
})
export class EditIncomeDialog {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);

  readonly income = this.config.data.income as CaseIncomeRow;

  readonly payments = signal<IncomePayment[]>([...this.income.payments]);
  readonly caseAmount = signal<number>(this.income.caseAmount);

  readonly paidAmount = computed(() => this.payments().reduce((sum, p) => sum + p.amount, 0));
  readonly balance = computed(() => Math.max(this.caseAmount() - this.paidAmount(), 0));
  readonly paidPercentage = computed(() =>
    this.caseAmount() > 0 ? Math.round((this.paidAmount() / this.caseAmount()) * 100) : 0,
  );

  readonly paymentMethods = [
    { label: 'Transferencia', value: 'Transferencia' },
    { label: 'Depósito', value: 'Depósito' },
    { label: 'Cheque', value: 'Cheque' },
    { label: 'Efectivo', value: 'Efectivo' },
  ];

  readonly showPaymentForm = signal(false);
  paymentDate: Date | null = null;
  paymentAmount: number | null = null;
  paymentMethod: string | null = null;
  paymentDocument = '';
  paymentObservation = '';
  readonly paymentAttachment = signal<string | null>(null);

  get canSavePayment(): boolean {
    return !!this.paymentDate && !!this.paymentAmount && this.paymentAmount > 0 && !!this.paymentMethod;
  }

  close(): void {
    this.ref.close();
  }

  save(): void {
    this.ref.close({ payments: this.payments(), caseAmount: this.caseAmount() });
  }

  openPaymentForm(): void {
    this.paymentDate = null;
    this.paymentAmount = null;
    this.paymentMethod = null;
    this.paymentDocument = '';
    this.paymentObservation = '';
    this.paymentAttachment.set(null);
    this.showPaymentForm.set(true);
  }

  cancelPaymentForm(): void {
    this.showPaymentForm.set(false);
  }

  attachPaymentFile(): void {
    this.paymentAttachment.set('comprobante-pago.pdf');
  }

  savePayment(): void {
    if (!this.canSavePayment) return;

    this.payments.update((list) => [
      ...list,
      {
        id: `p${list.length + 1}`,
        date: this.formatDate(this.paymentDate!),
        amount: this.paymentAmount!,
        paymentMethod: this.paymentMethod!,
        user: 'Admin',
        documentNumber: this.paymentDocument || undefined,
        observation: this.paymentObservation || undefined,
        attachmentName: this.paymentAttachment() ?? undefined,
      },
    ]);

    this.showPaymentForm.set(false);
  }

  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}/${date.getFullYear()}`;
  }
}
