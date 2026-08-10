import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LawsuitFilingRow } from '../../lawsuit-filing.models';

export interface DocumentUploadResult {
  expenseRecordFileName?: string;
  finalDocumentFileName?: string;
  stateDocumentFileName?: string;
}

@Component({
  selector: 'app-document-upload-dialog',
  imports: [CommonModule],
  templateUrl: './document-upload-dialog.html',
  styleUrl: './document-upload-dialog.scss',
})
export class DocumentUploadDialog {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);

  readonly row = this.config.data.row as LawsuitFilingRow;
  readonly isAdministrative = this.row.expenseType === 'Administrativo';

  readonly expenseRecordFileName = signal(this.row.expenseRecordFileName ?? '');
  readonly finalDocumentFileName = signal(this.row.finalDocumentFileName ?? '');
  readonly stateDocumentFileName = signal(this.row.stateDocumentFileName ?? '');

  onFileSelect(kind: 'expenseRecord' | 'finalDocument' | 'stateDocument', event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (kind === 'expenseRecord') this.expenseRecordFileName.set(file.name);
    else if (kind === 'finalDocument') this.finalDocumentFileName.set(file.name);
    else this.stateDocumentFileName.set(file.name);
  }

  close(): void {
    this.ref.close();
  }

  save(): void {
    this.ref.close({
      expenseRecordFileName: this.expenseRecordFileName() || undefined,
      finalDocumentFileName: this.finalDocumentFileName() || undefined,
      stateDocumentFileName: this.stateDocumentFileName() || undefined,
    } satisfies DocumentUploadResult);
  }
}
