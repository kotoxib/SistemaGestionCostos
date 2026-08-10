export type DefendantLegalRole = 'Defendant' | 'CoDefendant' | 'Guarantor';

export interface IDefendant {
  id: number;
  clientId: number;
  clientName: string;
  documentType: string;
  documentNumber: string;
  fullName: string;
  legalRole: DefendantLegalRole;
  phone: string;
  address: string;
  email: string;
  refundTemplate: string;
  fileModel: string;
  state: number;
}
