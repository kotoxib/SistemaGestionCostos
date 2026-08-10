import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, signal, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeeRequestStore } from '@features/financial-management/fee-request/fee-request.store';
import { PRIMENG_MODULES } from '@shared/components/primeng';
import { MessageDialogService } from '@shared/components/message-dialog/message-dialog.service';
import { Utilities } from '@shared/utils/utilities';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { RefundFormDialog, RefundFormResult } from './dialog/refund-form-dialog/refund-form-dialog';
import { SendEmailDialog } from './dialog/send-email-dialog/send-email-dialog';
import { EmailContact, RefundRow } from './refund.models';
import { REFUND_SAMPLE_DATA } from './refund.sample-data';

interface FilterOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-refund',
  imports: [CommonModule, FormsModule, ...PRIMENG_MODULES],
  providers: [DialogService],
  templateUrl: './refund.html',
  styleUrl: './refund.scss',
})
export class Refund implements OnDestroy {
  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);
  private readonly messageDialogService = inject(MessageDialogService);
  private readonly feeRequestStore = inject(FeeRequestStore);
  private dialogRef: DynamicDialogRef | null = null;

  searchTerm = '';
  registrationDate: Date | null = null;
  selectedState: string | null = null;

  readonly stateOptions: FilterOption[] = [
    { label: 'Generado', value: 'Generado' },
    { label: 'Procesado', value: 'Procesado' },
    { label: 'Anulado', value: 'Anulado' },
  ];

  readonly refunds = signal<RefundRow[]>(structuredClone(REFUND_SAMPLE_DATA));

  readonly contactsByClient: Record<string, EmailContact[]> = {
    'BCP S.A.': [
      { name: 'María López', email: 'mlopez@bcp.com.pe', checked: true },
      { name: 'Carlos Vega', email: 'cvega@bcp.com.pe', checked: false },
    ],
    'BBVA Perú': [{ name: 'Ana Torres', email: 'atorres@bbva.pe', checked: true }],
    Scotiabank: [{ name: 'Rosa Mamani', email: 'rmamani@scotiabank.pe', checked: true }],
  };

  get filteredRefunds(): RefundRow[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.refunds().filter((row) => {
      const matchesTerm =
        !term || row.caseNumber.toLowerCase().includes(term) || row.clientName.toLowerCase().includes(term);
      const matchesState = !this.selectedState || row.state === this.selectedState;

      return matchesTerm && matchesState;
    });
  }

  stateBadgeClass(state: RefundRow['state']): string {
    if (state === 'Generado') return 'badge-active';
    if (state === 'Procesado') return 'badge-info';
    return 'badge-inactive';
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.registrationDate = null;
    this.selectedState = null;
  }

  openCreateDialog(): void {
    this.dialogRef = this.openDialog(RefundFormDialog, { mode: 'create' }, 'min(820px, calc(100vw - 32px))');

    this.dialogRef?.onClose.subscribe((result?: RefundFormResult) => {
      if (!result) return;

      this.refunds.update((list) => {
        const next = list.length + 1;
        return [
          {
            id: next,
            caseNumber: result.caseNumber,
            clientName: result.clientName,
            defendantName: result.defendantName,
            templateFileName: result.templateFileName,
            totalAmount: result.expenses.reduce((sum, e) => sum + e.amount, 0),
            state: 'Generado' as const,
            date: new Date().toLocaleDateString('es-PE'),
            expenses: result.expenses,
          },
          ...list,
        ];
      });

      this.feeRequestStore.markAsRefunded(result.expenses.map((e) => e.feeRequestId));
      this.showToast('Reembolso creado exitosamente');
    });
  }

  openEditDialog(row: RefundRow): void {
    this.dialogRef = this.openDialog(
      RefundFormDialog,
      { mode: 'edit', row },
      'min(820px, calc(100vw - 32px))',
    );

    this.dialogRef?.onClose.subscribe((result?: RefundFormResult) => {
      if (!result) return;

      this.refunds.update((list) =>
        list.map((item) =>
          item.id === row.id
            ? {
                ...item,
                expenses: result.expenses,
                defendantName: result.defendantName,
                templateFileName: result.templateFileName,
                totalAmount: result.expenses.reduce((sum, e) => sum + e.amount, 0),
              }
            : item,
        ),
      );

      this.feeRequestStore.markAsRefunded(result.expenses.map((e) => e.feeRequestId));
      this.showToast('Reembolso actualizado exitosamente');
    });
  }

  openSendEmailDialog(row: RefundRow): void {
    const contacts = this.contactsByClient[row.clientName] ?? [
      { name: row.clientName, email: 'contacto@sigcomt.pe', checked: true },
    ];

    const ref = this.openDialog(
      SendEmailDialog,
      { refund: row, contacts: contacts.map((c) => ({ ...c })) },
      'min(600px, calc(100vw - 32px))',
    );

    ref?.onClose.subscribe((result?: { sent: boolean }) => {
      if (result?.sent) {
        this.showToast('Correo enviado correctamente');
      }
    });
  }

  download(row: RefundRow): void {
    const lines: string[] = [];
    lines.push(`Reembolso;${row.caseNumber}`);
    lines.push(`Cliente;${row.clientName}`);
    lines.push(`Demandado;${row.defendantName ?? '—'}`);
    lines.push(`Plantilla;${row.templateFileName ?? '—'}`);
    lines.push(`Fecha;${row.date}`);
    lines.push(`Estado;${row.state}`);
    lines.push('');
    lines.push('Cód. Solicitud;Demandado;N° Expediente;Concepto;Tipo de Gasto;Importe S/');
    row.expenses.forEach((e) => {
      lines.push(`${e.requestCode};${e.defendant};${e.fileNumber};${e.concept};${e.expenseType};${e.amount.toFixed(2)}`);
    });
    lines.push('');
    lines.push(`;;;;Total;${row.totalAmount.toFixed(2)}`);

    const templateLabel = row.templateFileName?.replace(/\.[^.]+$/, '') ?? 'PLANTILLA_REEMBOLSO';
    const filename = `Reembolso_${row.caseNumber}_${templateLabel}.csv`;

    Utilities.downloadTextFile(filename, lines.join('\n'));
    this.showToast('Plantilla descargada en Excel');
  }

  async deleteRefund(row: RefundRow): Promise<void> {
    const result = await this.messageDialogService.confirmWarning(
      '¿Eliminar reembolso?',
      `Estás a punto de eliminar el reembolso de ${row.clientName} (${row.caseNumber}). Esta acción no se puede deshacer.`,
    );

    if (!result.confirmed) return;

    this.refunds.update((list) => list.filter((item) => item.id !== row.id));

    this.showToast('Reembolso eliminado exitosamente');
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
