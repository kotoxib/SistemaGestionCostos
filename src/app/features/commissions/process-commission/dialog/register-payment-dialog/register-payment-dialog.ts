import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PRIMENG_MODULES } from '@shared/components/primeng';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdvanceType, ProcessCommission } from '../../process-commission.models';

export interface RegisterPaymentResult {
  type: AdvanceType;
  amount: number;
  comment?: string;
}

@Component({
  selector: 'app-register-payment-dialog',
  imports: [CommonModule, FormsModule, ...PRIMENG_MODULES],
  templateUrl: './register-payment-dialog.html',
  styleUrl: './register-payment-dialog.scss',
})
export class RegisterPaymentDialog {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);

  readonly caseRow = this.config.data.caseRow as ProcessCommission;

  readonly typeOptions: { label: string; value: AdvanceType }[] = [
    { label: 'Adelanto (cliente aún debe saldo)', value: 'Adelanto' },
    { label: 'Pago Parcial (parte de la comisión)', value: 'Parcial' },
    { label: 'Liquidación Total (saldo completo)', value: 'Total' },
  ];

  readonly type = signal<AdvanceType>(this.caseRow.paidPercentage < 100 ? 'Adelanto' : 'Parcial');
  readonly amount = signal<number | null>(null);
  readonly comment = signal('');

  readonly isOverdraft = computed(() => {
    const value = this.amount();
    return !!value && value > this.caseRow.commissionBalance;
  });

  get canSave(): boolean {
    const value = this.amount();
    return !!value && value > 0 && !this.isOverdraft();
  }

  close(): void {
    this.ref.close();
  }

  save(): void {
    if (!this.canSave) return;

    this.ref.close({
      type: this.type(),
      amount: this.amount()!,
      comment: this.comment() || undefined,
    } satisfies RegisterPaymentResult);
  }
}
