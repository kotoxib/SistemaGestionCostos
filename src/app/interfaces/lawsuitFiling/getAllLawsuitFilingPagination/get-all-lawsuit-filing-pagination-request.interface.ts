import { IPaginationRequest } from '@core/interfaces/pagination';
import { FeeRequestExpenseType, FeeRequestState } from '@interfaces/feeRequest';

export interface GetAllLawsuitFilingPaginationRequest extends IPaginationRequest {
  searchText?: string | null;
  caseNumber?: string | null;
  expenseType?: FeeRequestExpenseType | null;
  state?: FeeRequestState | null;
}
