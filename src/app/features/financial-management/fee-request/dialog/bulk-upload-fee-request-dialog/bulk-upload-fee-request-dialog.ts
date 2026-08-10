import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { PRIMENG_MODULES } from '@shared/components/primeng';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

interface FeeRequestPreviewRow {
  code: string;
  bank: string;
  caseNumber: string;
  fileNumber: string;
  concept: string;
  court: string;
  amount: number;
  requester: string;
  observation: string;
  isRefundable: string;
  date: string;
}

@Component({
  selector: 'app-bulk-upload-fee-request-dialog',
  imports: [CommonModule, ...PRIMENG_MODULES],
  templateUrl: './bulk-upload-fee-request-dialog.html',
  styleUrl: './bulk-upload-fee-request-dialog.scss',
})
export class BulkUploadFeeRequestDialog {
  @ViewChild('fileInput') private fileInput?: ElementRef<HTMLInputElement>;

  private readonly ref = inject(DynamicDialogRef);

  readonly isDragOver = signal(false);
  readonly selectedFileName = signal<string | null>(null);
  readonly fileError = signal<string | null>(null);
  readonly previewRows = signal<FeeRequestPreviewRow[]>([]);

  openFilePicker(): void {
    this.fileInput?.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.setSelectedFile(file);
    }

    input.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    const file = event.dataTransfer?.files?.[0];

    if (file) {
      this.setSelectedFile(file);
    }
  }

  cancel(): void {
    this.ref.close();
  }

  upload(): void {
    if (!this.selectedFileName()) {
      this.fileError.set('Selecciona o arrastra un archivo Excel para continuar.');
      return;
    }

    this.ref.close({
      fileName: this.selectedFileName(),
      rows: this.previewRows(),
    });
  }

  private setSelectedFile(file: File): void {
    const extension = file.name.split('.').pop()?.toLowerCase();
    const isExcelFile = extension === 'xlsx' || extension === 'xls';

    if (!isExcelFile) {
      this.selectedFileName.set(null);
      this.fileError.set('El archivo debe tener formato .xlsx o .xls.');
      return;
    }

    this.selectedFileName.set(file.name);
    this.fileError.set(null);
  }
}
