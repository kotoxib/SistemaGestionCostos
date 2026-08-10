import { FeeRequestExpenseType, FeeRequestState } from '../fee-request.interface';

export interface GetAllFeeRequestPaginationResponse {
  id: number;
  code: string;
  entity: string;
  bank: string;
  caseNumber: string;
  expenseType: FeeRequestExpenseType;
  expenseName: string;
  concept: string;
  amount: number;
  date: string;
  state: FeeRequestState;
}
