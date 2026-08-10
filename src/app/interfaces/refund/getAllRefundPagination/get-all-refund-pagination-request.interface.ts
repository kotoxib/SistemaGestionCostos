import { IPaginationRequest } from '@core/interfaces/pagination';
import { RefundState } from '../refund.interface';

export interface GetAllRefundPaginationRequest extends IPaginationRequest {
  searchText?: string | null;
  clientId?: number | null;
  caseNumber?: string | null;
  state?: RefundState | null;
}
