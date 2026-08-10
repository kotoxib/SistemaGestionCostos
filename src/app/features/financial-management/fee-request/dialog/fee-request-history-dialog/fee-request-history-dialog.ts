import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FeeRequestRow } from '../../fee-request.models';

@Component({
  selector: 'app-fee-request-history-dialog',
  imports: [CommonModule],
  templateUrl: './fee-request-history-dialog.html',
  styleUrl: './fee-request-history-dialog.scss',
})
export class FeeRequestHistoryDialog {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);

  readonly feeRequest = this.config.data.feeRequest as FeeRequestRow;

  close(): void {
    this.ref.close();
  }

  dotClass(state: string): string {
    const map: Record<string, string> = {
      Registrado: 'dot-sky',
      Pagado: 'dot-green',
      Reembolsado: 'dot-purple',
      'Concluído': 'dot-gray',
    };

    return map[state] ?? 'dot-gray';
  }
}
