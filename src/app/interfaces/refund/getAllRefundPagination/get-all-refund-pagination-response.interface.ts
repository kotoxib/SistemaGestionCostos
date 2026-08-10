import { RefundState } from '../refund.interface';

export interface GetAllRefundPaginationResponse {
  id: number;
  caseNumber: string;
  clientName: string;
  totalAmount: number;
  state: RefundState;
  date: string;
}
