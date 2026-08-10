import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, computed, inject, signal } from '@angular/core';
import { PRIMENG_MODULES } from '@shared/components/primeng';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BulkPreviewRow, BulkUploadKind } from '../../lawsuit-filing.models';

@Component({
  selector: 'app-bulk-document-upload-dialog',
  imports: [CommonModule, ...PRIMENG_MODULES],
  templateUrl: './bulk-document-upload-dialog.html',
  styleUrl: './bulk-document-upload-dialog.scss',
})
export class BulkDocumentUploadDialog {
  @ViewChild('fileInput') private fileInput?: ElementRef<HTMLInputElement>;

  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);

  readonly kind = this.config.data.kind as BulkUploadKind;

  readonly title = this.kind === 'expenseRecord' ? 'Carga de Registro de Gasto' : 'Carga de Documento Final';

  readonly isDragOver = signal(false);
  readonly selectedFileName = signal<string | null>(null);
  readonly fileError = signal<string | null>(null);
  readonly previewRows = signal<BulkPreviewRow[]>([]);

  readonly matchedCount = computed(() => this.previewRows().filter((r) => r.found).length);

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

  confirm(): void {
    const codes = this.previewRows()
      .filter((r) => r.found)
      .map((r) => r.code);

    if (codes.length === 0) return;

    this.ref.close({ codes });
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

    const suffix = this.kind === 'expenseRecord' ? 'reg_gasto' : 'demanda';
    this.previewRows.set([
      { code: 'SGC-2025-0006', caseNumber: 'CJ-2025-0006', clientName: 'Tecnología & Servicios S.R.L.', concept: 'Gasto administrativo', fileName: `${suffix}_006.pdf`, found: true },
      { code: 'SGC-2025-0009', caseNumber: 'CJ-2025-0009', clientName: 'Marco Antonio Villanueva Chávez', concept: 'Gasto administrativo', fileName: `${suffix}_009.pdf`, found: true },
      { code: 'SGC-2025-0098', caseNumber: 'CJ-2025-0098', clientName: '—', concept: '—', fileName: `${suffix}_098.pdf`, found: false },
    ]);
  }
}
