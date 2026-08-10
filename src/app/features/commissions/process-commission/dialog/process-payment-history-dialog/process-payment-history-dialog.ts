import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PRIMENG_MODULES } from '@shared/components/primeng';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommissionAdvance, ProcessCommission } from '../../process-commission.models';

@Component({
  selector: 'app-process-payment-history-dialog',
  imports: [CommonModule, ...PRIMENG_MODULES],
  templateUrl: './process-payment-history-dialog.html',
  styleUrl: './process-payment-history-dialog.scss',
})
export class ProcessPaymentHistoryDialog {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);

  readonly caseRow = this.config.data.caseRow as ProcessCommission;

  get advances(): CommissionAdvance[] {
    return [...this.caseRow.advances].sort((a, b) => b.date.localeCompare(a.date));
  }

  typeBadge(type: CommissionAdvance['type']): string {
    if (type === 'Adelanto') return 'badge-amber';
    if (type === 'Parcial') return 'badge-info';
    return 'badge-active';
  }

  typeLabel(type: CommissionAdvance['type']): string {
    if (type === 'Adelanto') return 'Adelanto';
    if (type === 'Parcial') return 'Pago Parcial';
    return 'Pago Total';
  }

  stateBadge(state: CommissionAdvance['state']): string {
    return state === 'Procesado' ? 'badge-active' : 'badge-inactive';
  }

  close(): void {
    this.ref.close();
  }
}
