import { DefendantLegalRole } from '../defendant.interface';

export interface GetAllDefendantPaginationResponse {
  id: number;
  clientName: string;
  documentNumber: string;
  fullName: string;
  legalRole: DefendantLegalRole;
  phone: string;
  email: string;
  state: number;
}
