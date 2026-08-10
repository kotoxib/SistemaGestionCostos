import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { PRIMENG_MODULES } from '@shared/components/primeng';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  CaseCatalogEntry,
  FeeRequestExpenseType,
  FeeRequestRow,
  FeeTypeCatalogEntry,
} from '../../fee-request.models';

export type FeeRequestFormMode = 'create' | 'view' | 'edit';

export interface FeeRequestFormResult {
  caseNumber: string;
  clientName: string;
  fileNumber: string;
  concept: string;
  expenseType: FeeRequestExpenseType;
  amount: number;
  currency: string;
  date: string;
  requesterName: string;
  isRefundable: 'Sí' | 'No';
  attachmentName?: string;
  finalDocumentName?: string;
  observation?: string;
}

@Component({
  selector: 'app-fee-request-form-dialog',
  imports: [CommonModule, FormsModule, ...PRIMENG_MODULES],
  templateUrl: './fee-request-form-dialog.html',
  styleUrl: './fee-request-form-dialog.scss',
})
export class FeeRequestFormDialog {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);
  private readonly authService = inject(AuthService);

  readonly mode = this.config.data.mode as FeeRequestFormMode;
  readonly cases = (this.config.data.cases as CaseCatalogEntry[]) ?? [];
  readonly feeTypes = (this.config.data.feeTypes as FeeTypeCatalogEntry[]) ?? [];
  private readonly row = this.config.data.row as FeeRequestRow | undefined;

  readonly isView = this.mode === 'view';
  readonly isEdit = this.mode === 'edit';

  readonly caseOptions = this.cases.map((c) => ({ label: c.caseNumber, value: c.caseNumber }));

  readonly expenseTypeOptions: { label: string; value: FeeRequestExpenseType }[] = [
    { label: 'Administrativo', value: 'Administrativo' },
    { label: 'Judicial', value: 'Judicial' },
  ];

  readonly code = this.row?.code ?? '(generado automáticamente)';
  readonly selectedCaseNumber = signal(this.row?.caseNumber ?? '');
  readonly selectedExpenseType = signal<FeeRequestExpenseType | ''>(this.row?.expenseType ?? '');
  readonly selectedConcept = signal(this.row?.concept ?? '');
  readonly amount = signal<number | null>(this.row?.amount ?? null);
  readonly requestDate = signal<Date | null>(this.parseDate(this.row?.date));
  readonly observation = signal(this.row?.observation ?? '');
  readonly isRefundableChecked = signal(this.row?.isRefundable !== 'No');
  readonly attachmentName = signal<string | null>(this.row?.attachmentName ?? null);
  readonly finalDocumentName = signal<string | null>(this.row?.finalDocumentName ?? null);

  readonly requiresFinalDocument = computed(
    () => this.selectedExpenseType() === 'Judicial' && this.isRefundableChecked(),
  );

  readonly feeTypeOptions = computed(() =>
    this.feeTypes
      .filter((f) => f.type === this.selectedExpenseType())
      .map((f) => ({ label: f.name, value: f.name })),
  );

  readonly selectedCase = computed(
    () => this.cases.find((c) => c.caseNumber === this.selectedCaseNumber()) ?? null,
  );

  readonly clientName = computed(() => this.selectedCase()?.client ?? this.row?.clientName ?? '');
  readonly fileNumber = computed(() => this.selectedCase()?.fileNumber ?? this.row?.fileNumber ?? '');
  readonly court = computed(() => this.selectedCase()?.court ?? '');

  readonly requesterName = computed(() => {
    const claims = this.authService.identityClaims;
    const name = claims?.['name'] ?? claims?.['preferred_username'] ?? claims?.['email'];
    return this.row?.requesterName ?? (typeof name === 'string' && name ? name : 'Administrador');
  });

  readonly title = computed(() => {
    if (this.isView) return 'Detalle de Solicitud';
    if (this.isEdit) return 'Editar Solicitud';
    return 'Nueva Solicitud';
  });

  readonly subtitle = computed(() => {
    if (this.isView) return 'Visualización de solicitud (solo lectura)';
    if (this.isEdit) return 'Modificación de solicitud de arancel';
    return 'Registro de solicitud de arancel reembolsable';
  });

  onExpenseTypeChange(): void {
    this.selectedConcept.set('');
    this.isRefundableChecked.set(this.selectedExpenseType() === 'Judicial');
    if (this.selectedExpenseType() !== 'Judicial') {
      this.finalDocumentName.set(null);
    }
  }

  attachFile(): void {
    this.attachmentName.set('comprobante-pago.pdf');
  }

  attachFinalDocument(): void {
    this.finalDocumentName.set('documento-final.pdf');
  }

  get canSave(): boolean {
    return (
      !!this.selectedCaseNumber() &&
      !!this.selectedExpenseType() &&
      !!this.selectedConcept() &&
      !!this.amount() &&
      this.amount()! > 0 &&
      !!this.requestDate()
    );
  }

  close(): void {
    this.ref.close();
  }

  save(): void {
    if (!this.canSave) return;

    this.ref.close({
      caseNumber: this.selectedCaseNumber(),
      clientName: this.clientName(),
      fileNumber: this.fileNumber(),
      concept: this.selectedConcept(),
      expenseType: this.selectedExpenseType() as FeeRequestExpenseType,
      amount: this.amount()!,
      currency: 'S/',
      date: this.formatDate(this.requestDate()!),
      requesterName: this.requesterName(),
      isRefundable: this.isRefundableChecked() ? 'Sí' : 'No',
      attachmentName: this.attachmentName() ?? undefined,
      finalDocumentName: this.finalDocumentName() ?? undefined,
      observation: this.observation() || undefined,
    } satisfies FeeRequestFormResult);
  }

  private parseDate(date?: string): Date | null {
    if (!date) return null;
    const [d, m, y] = date.split('/').map(Number);
    return new Date(y, m - 1, d);
  }

  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}/${date.getFullYear()}`;
  }
}
