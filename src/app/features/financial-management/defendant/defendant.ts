import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PRIMENG_MODULES } from '@shared/components/primeng';
import { MessageDialogService } from '@shared/components/message-dialog/message-dialog.service';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import {
  DefendantFormDialog,
  DefendantFormResult,
} from './dialog/defendant-form-dialog/defendant-form-dialog';
import { DefendantRow } from './defendant.models';
import { DefendantStore } from './defendant.store';
import { DEFENDANT_CATALOG_BY_CLIENT, DEFENDANT_CLIENTS, INCOME_TEMPLATES } from './defendant.sample-data';

interface FilterOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-defendant',
  imports: [CommonModule, FormsModule, ...PRIMENG_MODULES],
  providers: [DialogService],
  templateUrl: './defendant.html',
  styleUrl: './defendant.scss',
})
export class Defendant implements OnDestroy {
  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);
  private readonly messageDialogService = inject(MessageDialogService);
  private readonly store = inject(DefendantStore);
  private dialogRef: DynamicDialogRef | null = null;

  searchTerm = '';
  registrationDate: Date | null = null;
  selectedState: string | null = null;

  readonly stateOptions: FilterOption[] = [
    { label: 'Activo', value: 'Activo' },
    { label: 'Inactivo', value: 'Inactivo' },
  ];

  readonly clients: string[] = DEFENDANT_CLIENTS;
  readonly catalogByClient = DEFENDANT_CATALOG_BY_CLIENT;
  readonly incomeTemplates = INCOME_TEMPLATES;

  get filteredDefendants(): DefendantRow[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.store.defendants().filter((row) => {
      const matchesTerm =
        !term || row.fullName.toLowerCase().includes(term) || row.documentNumber.toLowerCase().includes(term);
      const matchesState = !this.selectedState || row.state === this.selectedState;

      return matchesTerm && matchesState;
    });
  }

  legalRoleClass(role: DefendantRow['legalRole']): string {
    if (role === 'Demandado') return 'role-defendant';
    if (role === 'Co-demandado') return 'role-codefendant';
    return 'role-guarantor';
  }

  stateBadgeClass(state: DefendantRow['state']): string {
    return state === 'Activo' ? 'badge-active' : 'badge-inactive';
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.registrationDate = null;
    this.selectedState = null;
  }

  openCreateDialog(): void {
    this.dialogRef = this.openDialog(
      DefendantFormDialog,
      { mode: 'create', clients: this.clients, catalogByClient: this.catalogByClient, incomeTemplates: this.incomeTemplates },
      'min(720px, calc(100vw - 32px))',
    );

    this.dialogRef?.onClose.subscribe((result?: DefendantFormResult) => {
      if (!result) return;

      const next = this.store.defendants().length + 1;
      this.store.create({ id: next, ...result });
      this.showToast('Demandado registrado exitosamente');
    });
  }

  openEditDialog(row: DefendantRow): void {
    this.dialogRef = this.openDialog(
      DefendantFormDialog,
      {
        mode: 'edit',
        clients: this.clients,
        catalogByClient: this.catalogByClient,
        incomeTemplates: this.incomeTemplates,
        row,
      },
      'min(720px, calc(100vw - 32px))',
    );

    this.dialogRef?.onClose.subscribe((result?: DefendantFormResult) => {
      if (!result) return;

      this.store.updateById(row.id, result);
      this.showToast('Demandado actualizado exitosamente');
    });
  }

  async deleteDefendant(row: DefendantRow): Promise<void> {
    const result = await this.messageDialogService.confirmWarning(
      '¿Eliminar demandado?',
      `Estás a punto de eliminar a ${row.fullName}. Esta acción no se puede deshacer.`,
    );

    if (!result.confirmed) return;

    this.store.remove(row.id);

    this.showToast('Demandado eliminado exitosamente');
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
