import { IPaginationRequest } from '@core/interfaces/pagination';
import { FeeRequestExpenseType, FeeRequestState } from '../fee-request.interface';

export interface GetAllFeeRequestPaginationRequest extends IPaginationRequest {
  searchText?: string | null;
  caseNumber?: string | null;
  expenseType?: FeeRequestExpenseType | null;
  state?: FeeRequestState | null;
}
