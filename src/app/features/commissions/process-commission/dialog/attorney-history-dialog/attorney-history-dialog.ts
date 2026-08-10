import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PRIMENG_MODULES } from '@shared/components/primeng';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdvanceHistoryEntry, ProcessCommission } from '../../process-commission.models';

@Component({
  selector: 'app-attorney-history-dialog',
  imports: [CommonModule, ...PRIMENG_MODULES],
  templateUrl: './attorney-history-dialog.html',
  styleUrl: './attorney-history-dialog.scss',
})
export class AttorneyHistoryDialog {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);

  readonly attorney = this.config.data.attorney as string;
  private readonly processes = this.config.data.processes as ProcessCommission[];

  get advanceHistory(): AdvanceHistoryEntry[] {
    return this.processes
      .flatMap((p) => p.advances.map((a) => ({ ...a, caseNumber: p.caseNumber, clientName: p.clientName })))
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  get historySummary() {
    const history = this.advanceHistory;
    const summarize = (type: AdvanceHistoryEntry['type']) => {
      const entries = history.filter((h) => h.type === type && h.state === 'Procesado');
      return { count: entries.length, amount: entries.reduce((sum, e) => sum + e.amount, 0) };
    };

    return {
      advance: summarize('Adelanto'),
      partial: summarize('Parcial'),
      total: summarize('Total'),
    };
  }

  advanceTypeBadge(type: AdvanceHistoryEntry['type']): string {
    if (type === 'Adelanto') return 'badge-amber';
    if (type === 'Parcial') return 'badge-info';
    return 'badge-active';
  }

  advanceTypeLabel(type: AdvanceHistoryEntry['type']): string {
    if (type === 'Adelanto') return 'Adelanto';
    if (type === 'Parcial') return 'Pago Parcial';
    return 'Pago Total';
  }

  advanceStateBadge(state: AdvanceHistoryEntry['state']): string {
    return state === 'Procesado' ? 'badge-active' : 'badge-inactive';
  }

  close(): void {
    this.ref.close();
  }
}
