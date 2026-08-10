import { FeeRequestExpenseType, FeeRequestState } from '@interfaces/feeRequest';

export interface GetAllLawsuitFilingPaginationResponse {
  id: number;
  code: string;
  bank: string;
  caseNumber: string;
  expenseName: string;
  expenseType: FeeRequestExpenseType;
  court: string;
  amount: number;
  date: string;
  state: FeeRequestState;
}
