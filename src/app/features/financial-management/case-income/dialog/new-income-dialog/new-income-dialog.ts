import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PRIMENG_MODULES } from '@shared/components/primeng';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CaseOption } from '../../case-income.models';

@Component({
  selector: 'app-new-income-dialog',
  imports: [CommonModule, FormsModule, ...PRIMENG_MODULES],
  templateUrl: './new-income-dialog.html',
  styleUrl: './new-income-dialog.scss',
})
export class NewIncomeDialog {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);

  readonly cases = (this.config.data.cases as CaseOption[]) ?? [];
  readonly caseOptions = this.cases.map((c) => ({ label: `${c.id} – ${c.client}`, value: c.id }));

  readonly selectedCaseId = signal<string | null>(null);

  readonly selectedCase = computed(
    () => this.cases.find((c) => c.id === this.selectedCaseId()) ?? null,
  );

  close(): void {
    this.ref.close();
  }

  save(): void {
    if (!this.selectedCaseId()) return;

    this.ref.close({ caseId: this.selectedCaseId() });
  }
}
