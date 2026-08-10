import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PRIMENG_MODULES } from '@shared/components/primeng';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EmailContact, RefundRow } from '../../refund.models';

interface ContactOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-send-email-dialog',
  imports: [CommonModule, FormsModule, ...PRIMENG_MODULES],
  templateUrl: './send-email-dialog.html',
  styleUrl: './send-email-dialog.scss',
})
export class SendEmailDialog {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);

  readonly refund = this.config.data.refund as RefundRow;
  readonly fromEmail = 'estudiolegal@sigcomt.pe';

  readonly contactOptions: ContactOption[] = (this.config.data.contacts as EmailContact[]).map((c) => ({
    label: c.name,
    value: c.email,
  }));

  selectedTo: string[] = (this.config.data.contacts as EmailContact[])
    .filter((c) => c.checked)
    .map((c) => c.email);

  cc = '';
  subject = `Reembolso ${this.refund.caseNumber}`;
  message =
    `Estimados señores de ${this.refund.clientName},\n\n` +
    `Por medio del presente, les hacemos llegar el documento de reembolso correspondiente al caso ${this.refund.caseNumber}.\n\n` +
    `Quedamos a su disposición para cualquier consulta adicional.\n\n` +
    `Saludos cordiales,\nEstudio Legal`;

  readonly attachmentName = `Reembolso ${this.refund.caseNumber}`;

  get canSend(): boolean {
    return this.selectedTo.length > 0 && this.subject.trim().length > 0;
  }

  close(): void {
    this.ref.close();
  }

  send(): void {
    if (!this.canSend) return;

    this.ref.close({ sent: true });
  }
}
