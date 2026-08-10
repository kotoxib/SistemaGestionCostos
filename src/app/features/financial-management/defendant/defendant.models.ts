export type LegalRole = 'Demandado' | 'Co-demandado' | 'Garante';
export type DefendantState = 'Activo' | 'Inactivo';

export interface DefendantRow {
  id: number;
  clientName: string;
  documentType: string;
  documentNumber: string;
  fullName: string;
  legalRole: LegalRole;
  phone: string;
  address: string;
  email: string;
  refundTemplate: string;
  fileModel: string;
  state: DefendantState;
}

export interface DefendantCatalogEntry {
  fullName: string;
  documentType: string;
  documentNumber: string;
  legalRole: LegalRole;
}

export interface IncomeTemplateOption {
  clientName: string;
  fileName: string;
  type: 'Reembolso' | 'Archivo - Cuadro';
}
