import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PRIMENG_MODULES } from '@shared/components/primeng';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  DefendantCatalogEntry,
  DefendantRow,
  DefendantState,
  IncomeTemplateOption,
  LegalRole,
} from '../../defendant.models';

export type DefendantFormMode = 'create' | 'edit';
export type DefendantFormResult = Omit<DefendantRow, 'id'>;

@Component({
  selector: 'app-defendant-form-dialog',
  imports: [CommonModule, FormsModule, ...PRIMENG_MODULES],
  templateUrl: './defendant-form-dialog.html',
  styleUrl: './defendant-form-dialog.scss',
})
export class DefendantFormDialog {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);

  readonly mode = this.config.data.mode as DefendantFormMode;
  readonly clients = (this.config.data.clients as string[]) ?? [];
  readonly catalogByClient = (this.config.data.catalogByClient as Record<string, DefendantCatalogEntry[]>) ?? {};
  readonly incomeTemplates = (this.config.data.incomeTemplates as IncomeTemplateOption[]) ?? [];
  private readonly row = this.config.data.row as DefendantRow | undefined;

  readonly isEdit = this.mode === 'edit';
  readonly clientOptions = this.clients.map((c) => ({ label: c, value: c }));
  readonly legalRoleOptions: { label: string; value: LegalRole }[] = [
    { label: 'Demandado', value: 'Demandado' },
    { label: 'Co-demandado', value: 'Co-demandado' },
    { label: 'Garante', value: 'Garante' },
  ];
  readonly stateOptions: { label: string; value: DefendantState }[] = [
    { label: 'Activo', value: 'Activo' },
    { label: 'Inactivo', value: 'Inactivo' },
  ];

  readonly selectedClient = signal(this.row?.clientName ?? '');
  readonly selectedDefendantName = signal(this.row?.fullName ?? '');
  readonly documentType = signal(this.row?.documentType ?? '');
  readonly documentNumber = signal(this.row?.documentNumber ?? '');
  readonly legalRole = signal<LegalRole>(this.row?.legalRole ?? 'Demandado');
  readonly phone = signal(this.row?.phone ?? '');
  readonly address = signal(this.row?.address ?? '');
  readonly email = signal(this.row?.email ?? '');
  readonly refundTemplate = signal(this.row?.refundTemplate ?? '');
  readonly fileModel = signal(this.row?.fileModel ?? '');
  readonly state = signal<DefendantState>(this.row?.state ?? 'Activo');

  readonly defendantOptions = computed(() =>
    (this.catalogByClient[this.selectedClient()] ?? []).map((d) => ({ label: d.fullName, value: d.fullName })),
  );

  readonly refundTemplateOptions = computed(() =>
    this.incomeTemplates
      .filter((t) => t.clientName === this.selectedClient() && t.type === 'Reembolso')
      .map((t) => ({ label: t.fileName, value: t.fileName })),
  );

  readonly fileModelOptions = computed(() =>
    this.incomeTemplates
      .filter((t) => t.clientName === this.selectedClient() && t.type === 'Archivo - Cuadro')
      .map((t) => ({ label: t.fileName, value: t.fileName })),
  );

  onClientChange(client: string): void {
    this.selectedClient.set(client);
    this.selectedDefendantName.set('');
    this.documentType.set('');
    this.documentNumber.set('');
    this.legalRole.set('Demandado');
    this.refundTemplate.set('');
    this.fileModel.set('');
  }

  onDefendantChange(name: string): void {
    this.selectedDefendantName.set(name);
    const found = (this.catalogByClient[this.selectedClient()] ?? []).find((d) => d.fullName === name);
    if (found) {
      this.documentType.set(found.documentType);
      this.documentNumber.set(found.documentNumber);
      this.legalRole.set(found.legalRole);
    }
  }

  get canSave(): boolean {
    return !!this.selectedClient() && !!this.selectedDefendantName();
  }

  close(): void {
    this.ref.close();
  }

  save(): void {
    if (!this.canSave) return;

    this.ref.close({
      clientName: this.selectedClient(),
      fullName: this.selectedDefendantName(),
      documentType: this.documentType(),
      documentNumber: this.documentNumber(),
      legalRole: this.legalRole(),
      phone: this.phone(),
      address: this.address(),
      email: this.email(),
      refundTemplate: this.refundTemplate(),
      fileModel: this.fileModel(),
      state: this.state(),
    } satisfies DefendantFormResult);
  }
}
