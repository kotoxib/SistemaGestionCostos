import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PRIMENG_MODULES } from '@shared/components/primeng';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import {
  DocumentUploadDialog,
  DocumentUploadResult,
} from './dialog/document-upload-dialog/document-upload-dialog';
import { BulkDocumentUploadDialog } from './dialog/bulk-document-upload-dialog/bulk-document-upload-dialog';
import { DownloadDialog } from './dialog/download-dialog/download-dialog';
import { LawsuitFilingRow } from './lawsuit-filing.models';

interface FilterOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-lawsuit-filing',
  imports: [CommonModule, FormsModule, ...PRIMENG_MODULES],
  providers: [DialogService],
  templateUrl: './lawsuit-filing.html',
  styleUrl: './lawsuit-filing.scss',
})
export class LawsuitFiling implements OnDestroy {
  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);
  private dialogRef: DynamicDialogRef | null = null;

  searchTerm = '';
  registrationDate: Date | null = null;
  selectedState: string | null = null;

  readonly stateOptions: FilterOption[] = [
    { label: 'Registrado', value: 'Registrado' },
    { label: 'Pagado', value: 'Pagado' },
    { label: 'Reembolsado', value: 'Reembolsado' },
    { label: 'Concluído', value: 'Concluído' },
  ];

  readonly clients: string[] = [
    'BCP S.A.',
    'BBVA Perú',
    'Constructora Andina S.A.C.',
    'Inmobiliaria del Norte S.A.C.',
    'Grupo Empresarial Lima S.A.C.',
    'Tecnología & Servicios S.R.L.',
    'Juan Carlos Mendoza Ríos',
    'Rosa Elena Gutiérrez Salas',
    'Marco Antonio Villanueva Chávez',
    'Carmen Lucía Paredes Tapia',
  ];

  readonly lawsuitFilings: LawsuitFilingRow[] = [
    {
      id: 1,
      code: 'SGC-2025-0001',
      clientName: 'BCP S.A.',
      caseNumber: 'CJ-2025-0001',
      fileNumber: 'EXP-2025-0001',
      expenseName: 'Aranceles Judiciales',
      concept: 'Arancel de Demanda',
      expenseType: 'Judicial',
      court: '1° Juzgado Civil de Lima',
      amount: 320.0,
      requester: 'B. Jiménez',
      date: '02/01/2025',
      state: 'Reembolsado',
      expenseRecordLoaded: true,
      expenseRecordFileName: 'arancel_001.pdf',
      finalDocumentLoaded: true,
      finalDocumentFileName: 'demanda_001.pdf',
      finalStateChecked: true,
      stateDocumentFileName: 'estado_001.pdf',
    },
    {
      id: 2,
      code: 'SGC-2025-0002',
      clientName: 'BBVA Perú',
      caseNumber: 'CJ-2025-0002',
      fileNumber: 'EXP-2025-0002',
      expenseName: 'Gastos Notariales',
      concept: 'Arancel de Apelación',
      expenseType: 'Judicial',
      court: '2° Juzgado Civil de Lima',
      amount: 215.5,
      requester: 'B. Jiménez',
      date: '08/01/2025',
      state: 'Concluído',
      expenseRecordLoaded: true,
      expenseRecordFileName: 'arancel_002.pdf',
      finalDocumentLoaded: true,
      finalDocumentFileName: 'demanda_002.pdf',
      finalStateChecked: true,
    },
    {
      id: 3,
      code: 'SGC-2025-0003',
      clientName: 'Constructora Andina S.A.C.',
      caseNumber: 'CJ-2025-0003',
      fileNumber: 'EXP-2025-0003',
      expenseName: 'Transporte y Movilidad',
      concept: 'Gasto administrativo',
      expenseType: 'Administrativo',
      court: '3° Juzgado Civil de Lima',
      amount: 120.0,
      requester: 'B. Jiménez',
      date: '05/01/2025',
      state: 'Concluído',
      expenseRecordLoaded: true,
      expenseRecordFileName: 'reg_gasto_003.pdf',
      finalDocumentLoaded: false,
      finalStateChecked: true,
    },
    {
      id: 4,
      code: 'SGC-2025-0004',
      clientName: 'Inmobiliaria del Norte S.A.C.',
      caseNumber: 'CJ-2025-0004',
      fileNumber: 'EXP-2025-0004',
      expenseName: 'Comunicaciones y Courier',
      concept: 'Gasto administrativo',
      expenseType: 'Administrativo',
      court: '4° Juzgado Civil de Lima',
      amount: 85.0,
      requester: 'B. Jiménez',
      date: '12/01/2025',
      state: 'Pagado',
      expenseRecordLoaded: true,
      expenseRecordFileName: 'reg_gasto_004.pdf',
      finalDocumentLoaded: false,
      finalStateChecked: true,
    },
    {
      id: 6,
      code: 'SGC-2025-0006',
      clientName: 'Tecnología & Servicios S.R.L.',
      caseNumber: 'CJ-2025-0006',
      fileNumber: 'EXP-2025-0006',
      expenseName: 'Honorarios Administrativos',
      concept: 'Gasto administrativo',
      expenseType: 'Administrativo',
      court: '6° Juzgado Civil de Lima',
      amount: 180.0,
      requester: 'B. Jiménez',
      date: '28/01/2025',
      state: 'Registrado',
      expenseRecordLoaded: false,
      finalDocumentLoaded: false,
      finalStateChecked: false,
    },
    {
      id: 9,
      code: 'SGC-2025-0009',
      clientName: 'Marco Antonio Villanueva Chávez',
      caseNumber: 'CJ-2025-0009',
      fileNumber: 'EXP-2025-0009',
      expenseName: 'Depósito de Garantía',
      concept: 'Gasto administrativo',
      expenseType: 'Administrativo',
      court: 'Sala Civil Transitoria',
      amount: 200.0,
      requester: 'B. Jiménez',
      date: '17/02/2025',
      state: 'Registrado',
      expenseRecordLoaded: false,
      finalDocumentLoaded: false,
      finalStateChecked: false,
    },
  ];

  get filteredLawsuitFilings(): LawsuitFilingRow[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.lawsuitFilings.filter((row) => {
      const matchesTerm =
        !term ||
        row.code.toLowerCase().includes(term) ||
        row.caseNumber.toLowerCase().includes(term) ||
        row.concept.toLowerCase().includes(term);

      const matchesState = !this.selectedState || row.state === this.selectedState;

      return matchesTerm && matchesState;
    });
  }

  stateBadgeClass(state: LawsuitFilingRow['state']): string {
    if (state === 'Pagado') return 'badge-active';
    if (state === 'Registrado') return 'badge-info';
    if (state === 'Reembolsado') return 'badge-purple';
    return 'badge-inactive';
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.registrationDate = null;
    this.selectedState = null;
  }

  openDocumentUploadDialog(row: LawsuitFilingRow): void {
    this.dialogRef = this.openDialog(
      DocumentUploadDialog,
      { row },
      'min(560px, calc(100vw - 32px))',
    );

    this.dialogRef?.onClose.subscribe((result?: DocumentUploadResult) => {
      if (!result) return;

      const isAdministrative = row.expenseType === 'Administrativo';
      const hasExpenseRecord = !!result.expenseRecordFileName;
      const hasFinalDocument = !!result.finalDocumentFileName;

      row.expenseRecordLoaded = hasExpenseRecord;
      row.expenseRecordFileName = result.expenseRecordFileName ?? row.expenseRecordFileName;
      row.finalDocumentLoaded = !isAdministrative && hasFinalDocument;
      row.finalDocumentFileName = result.finalDocumentFileName ?? row.finalDocumentFileName;
      row.stateDocumentFileName = result.stateDocumentFileName ?? row.stateDocumentFileName;
      row.finalStateChecked = isAdministrative ? hasExpenseRecord : hasFinalDocument;

      if (!isAdministrative && hasFinalDocument) {
        row.state = 'Reembolsado';
      } else if (isAdministrative && hasExpenseRecord) {
        row.state = 'Concluído';
      } else if (hasExpenseRecord && row.state === 'Registrado') {
        row.state = 'Pagado';
      }

      this.showToast('Documentos guardados exitosamente');
    });
  }

  openBulkExpenseRecordDialog(): void {
    this.openBulkDialog('expenseRecord');
  }

  openBulkFinalDocumentDialog(): void {
    this.openBulkDialog('finalDocument');
  }

  private openBulkDialog(kind: 'expenseRecord' | 'finalDocument'): void {
    const ref = this.openDialog(BulkDocumentUploadDialog, { kind }, 'min(920px, calc(100vw - 40px))');

    ref?.onClose.subscribe((result?: { codes: string[] }) => {
      if (!result) return;

      for (const row of this.lawsuitFilings) {
        if (!result.codes.includes(row.code)) continue;

        if (kind === 'expenseRecord') {
          row.expenseRecordLoaded = true;
          if (row.expenseType === 'Administrativo') {
            row.finalStateChecked = true;
            row.state = 'Concluído';
          } else if (row.state === 'Registrado') {
            row.state = 'Pagado';
          }
        } else {
          if (row.expenseType !== 'Administrativo') {
            row.finalDocumentLoaded = true;
            row.finalStateChecked = true;
            row.state = 'Reembolsado';
          }
        }
      }

      this.showToast('Documentos cargados exitosamente');
    });
  }

  openDownloadDialog(): void {
    this.openDialog(DownloadDialog, { rows: this.lawsuitFilings, clients: this.clients }, 'min(760px, calc(100vw - 32px))');
  }

  private openDialog(component: Type<unknown>, data: unknown, width: string): DynamicDialogRef | null {
    return this.dialogService.open(component, {
      showHeader: false,
      modal: true,
      dismissableMask: true,
      closeOnEscape: true,
      width,
      data,
      contentStyle: {
        padding: '0',
        borderRadius: '18px',
        overflow: 'hidden',
      },
      style: {
        borderRadius: '18px',
        overflow: 'hidden',
        boxShadow: '0 28px 70px rgba(15, 23, 42, 0.32)',
      },
      breakpoints: {
        '640px': 'calc(100vw - 22px)',
      },
    });
  }

  private showToast(summary: string): void {
    this.messageService.add({ severity: 'success', summary, life: 3000 });
  }

  ngOnDestroy(): void {
    this.dialogRef?.close();
  }
}
