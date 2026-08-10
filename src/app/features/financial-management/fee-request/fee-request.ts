import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PRIMENG_MODULES } from '@shared/components/primeng';
import { MessageDialogService } from '@shared/components/message-dialog/message-dialog.service';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { FeeRequestFormDialog, FeeRequestFormResult } from './dialog/fee-request-form-dialog/fee-request-form-dialog';
import { FeeRequestHistoryDialog } from './dialog/fee-request-history-dialog/fee-request-history-dialog';
import { BulkUploadFeeRequestDialog } from './dialog/bulk-upload-fee-request-dialog/bulk-upload-fee-request-dialog';
import { CaseCatalogEntry, FeeRequestRow, FeeTypeCatalogEntry } from './fee-request.models';
import { FeeRequestStore } from './fee-request.store';
import { SPL_CASE_CATALOG } from '@shared/data/spl-case-catalog.sample-data';

interface FilterOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-fee-request',
  imports: [CommonModule, FormsModule, ...PRIMENG_MODULES],
  providers: [DialogService],
  templateUrl: './fee-request.html',
  styleUrl: './fee-request.scss',
})
export class FeeRequest implements OnDestroy {
  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);
  private readonly messageDialogService = inject(MessageDialogService);
  private readonly store = inject(FeeRequestStore);
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

  readonly caseCatalog: CaseCatalogEntry[] = SPL_CASE_CATALOG.map((c) => ({
    caseNumber: c.caseNumber,
    client: c.client,
    entity: c.entity,
    fileNumber: c.fileNumber,
    court: c.court,
  }));

  readonly feeTypeCatalog: FeeTypeCatalogEntry[] = [
    { name: 'Arancel de Demanda', type: 'Judicial' },
    { name: 'Arancel de Apelación', type: 'Judicial' },
    { name: 'Arancel de Casación', type: 'Judicial' },
    { name: 'Arancel de Medida Cautelar', type: 'Judicial' },
    { name: 'Arancel de Ejecución de Sentencia', type: 'Judicial' },
    { name: 'Transporte y Movilidad', type: 'Administrativo' },
    { name: 'Comunicaciones y Courier', type: 'Administrativo' },
    { name: 'Copias Certificadas', type: 'Administrativo' },
    { name: 'Depósito de Garantía', type: 'Administrativo' },
    { name: 'Gastos de Peritos', type: 'Administrativo' },
    { name: 'Notificaciones Judiciales', type: 'Administrativo' },
  ];

  get filteredFeeRequests(): FeeRequestRow[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.store.feeRequests().filter((row) => {
      const matchesTerm =
        !term ||
        row.code.toLowerCase().includes(term) ||
        row.caseNumber.toLowerCase().includes(term) ||
        row.concept.toLowerCase().includes(term);

      const matchesState = !this.selectedState || row.state === this.selectedState;

      return matchesTerm && matchesState;
    });
  }

  stateBadgeClass(state: FeeRequestRow['state']): string {
    if (state === 'Pagado') return 'badge-active';
    if (state === 'Registrado') return 'badge-info';
    if (state === 'Reembolsado') return 'badge-purple';
    return 'badge-inactive';
  }

  expenseTypeBadgeClass(type: FeeRequestRow['expenseType']): string {
    return type === 'Judicial' ? 'badge-info' : 'badge-inactive';
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.registrationDate = null;
    this.selectedState = null;
  }

  openHistoryDialog(row: FeeRequestRow): void {
    this.openDialog(FeeRequestHistoryDialog, { feeRequest: row }, 'min(480px, calc(100vw - 32px))');
  }

  openCreateDialog(): void {
    this.dialogRef = this.openDialog(
      FeeRequestFormDialog,
      { mode: 'create', cases: this.caseCatalog, feeTypes: this.feeTypeCatalog },
      'min(760px, calc(100vw - 32px))',
    );

    this.dialogRef?.onClose.subscribe((result?: FeeRequestFormResult) => {
      if (!result) return;

      const next = this.store.feeRequests().length + 1;
      const entity = this.caseCatalog.find((c) => c.caseNumber === result.caseNumber)?.entity ?? '—';
      this.store.create({
        id: next,
        code: `SGC-2025-${String(next).padStart(4, '0')}`,
        date: result.date,
        entity,
        clientName: result.clientName,
        caseNumber: result.caseNumber,
        expenseType: result.expenseType,
        expenseName: result.concept,
        concept: result.concept,
        amount: result.amount,
        currency: result.currency,
        state: 'Registrado',
        fileNumber: result.fileNumber,
        requesterName: result.requesterName,
        observation: result.observation,
        isRefundable: result.isRefundable,
        attachmentName: result.attachmentName,
        finalDocumentName: result.finalDocumentName,
        history: [
          {
            action: 'Solicitud registrada',
            state: 'Registrado',
            date: result.date,
            time: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
            user: result.requesterName,
          },
        ],
      });

      this.showToast('Solicitud registrada exitosamente');
    });
  }

  openViewDialog(row: FeeRequestRow): void {
    this.openDialog(
      FeeRequestFormDialog,
      { mode: 'view', row, cases: this.caseCatalog, feeTypes: this.feeTypeCatalog },
      'min(760px, calc(100vw - 32px))',
    );
  }

  openEditDialog(row: FeeRequestRow): void {
    this.dialogRef = this.openDialog(
      FeeRequestFormDialog,
      { mode: 'edit', row, cases: this.caseCatalog, feeTypes: this.feeTypeCatalog },
      'min(760px, calc(100vw - 32px))',
    );

    this.dialogRef?.onClose.subscribe((result?: FeeRequestFormResult) => {
      if (!result) return;

      const entity = this.caseCatalog.find((c) => c.caseNumber === result.caseNumber)?.entity ?? row.entity;

      this.store.updateById(row.id, {
        caseNumber: result.caseNumber,
        entity,
        clientName: result.clientName,
        expenseType: result.expenseType,
        concept: result.concept,
        expenseName: result.concept,
        amount: result.amount,
        currency: result.currency,
        fileNumber: result.fileNumber,
        observation: result.observation,
        isRefundable: result.isRefundable,
        attachmentName: result.attachmentName,
        finalDocumentName: result.finalDocumentName,
        date: result.date,
      });

      this.showToast('Solicitud actualizada exitosamente');
    });
  }

  async openDeleteConfirm(row: FeeRequestRow): Promise<void> {
    const result = await this.messageDialogService.confirmWarning(
      '¿Eliminar solicitud?',
      `Estás a punto de eliminar la solicitud ${row.code}. Esta acción no se puede deshacer.`,
    );

    if (!result.confirmed) return;

    this.store.remove(row.id);

    this.showToast('Solicitud eliminada exitosamente');
  }

  openBulkUploadDialog(): void {
    this.openDialog(BulkUploadFeeRequestDialog, {}, 'min(920px, calc(100vw - 40px))');
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
