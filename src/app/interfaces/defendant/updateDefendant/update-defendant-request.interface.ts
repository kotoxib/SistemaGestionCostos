import { DefendantLegalRole } from '../defendant.interface';

export interface UpdateDefendantRequest {
  id: number;
  documentType: string;
  documentNumber: string;
  fullName: string;
  legalRole: DefendantLegalRole;
  phone: string;
  address: string;
  email: string;
  refundTemplate?: string;
  fileModel?: string;
  state: number;
}
