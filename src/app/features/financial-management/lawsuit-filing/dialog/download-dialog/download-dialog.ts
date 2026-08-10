import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PRIMENG_MODULES } from '@shared/components/primeng';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LawsuitFilingRow } from '../../lawsuit-filing.models';

@Component({
  selector: 'app-download-dialog',
  imports: [CommonModule, FormsModule, ...PRIMENG_MODULES],
  templateUrl: './download-dialog.html',
  styleUrl: './download-dialog.scss',
})
export class DownloadDialog {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);

  private readonly rows = this.config.data.rows as LawsuitFilingRow[];
  readonly clients = this.config.data.clients as string[];

  readonly clientOptions = this.clients.map((c) => ({ label: c, value: c }));

  readonly selectedClient = signal<string | null>(null);
  readonly caseSearch = signal('');
  readonly hasSearched = signal(false);
  readonly results = signal<LawsuitFilingRow[]>([]);
  readonly selectedCodes = signal<string[]>([]);

  readonly allSelected = computed(
    () => this.results().length > 0 && this.selectedCodes().length === this.results().length,
  );

  search(): void {
    const client = this.selectedClient();
    const term = this.caseSearch().trim().toLowerCase();

    const filtered = this.rows.filter((row) => {
      const matchesClient = !client || row.clientName === client;
      const matchesTerm =
        !term || row.caseNumber.toLowerCase().includes(term) || row.code.toLowerCase().includes(term);
      const hasAnyDocument = row.expenseRecordLoaded || row.finalDocumentLoaded || row.finalStateChecked;

      return matchesClient && matchesTerm && hasAnyDocument;
    });

    this.results.set(filtered);
    this.hasSearched.set(true);
    this.selectedCodes.set([]);
  }

  toggleSelection(code: string): void {
    this.selectedCodes.update((codes) =>
      codes.includes(code) ? codes.filter((c) => c !== code) : [...codes, code],
    );
  }

  toggleAll(): void {
    const allCodes = this.results().map((r) => r.code);
    this.selectedCodes.set(this.allSelected() ? [] : allCodes);
  }

  close(): void {
    this.ref.close();
  }

  download(): void {
    if (this.selectedCodes().length === 0) return;

    this.ref.close({ codes: this.selectedCodes() });
  }
}
