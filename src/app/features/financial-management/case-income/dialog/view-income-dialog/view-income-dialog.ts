import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PRIMENG_MODULES } from '@shared/components/primeng';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CaseIncomeRow } from '../../case-income.models';

@Component({
  selector: 'app-view-income-dialog',
  imports: [CommonModule, ...PRIMENG_MODULES],
  templateUrl: './view-income-dialog.html',
  styleUrl: './view-income-dialog.scss',
})
export class ViewIncomeDialog {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);

  readonly income = this.config.data.income as CaseIncomeRow;

  close(): void {
    this.ref.close();
  }
}
