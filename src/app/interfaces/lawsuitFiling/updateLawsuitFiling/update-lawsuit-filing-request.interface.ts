import { FeeRequestExpenseType } from '@interfaces/feeRequest';

export interface UpdateLawsuitFilingRequest {
  id: number;
  bank: string;
  caseNumber: string;
  fileNumber: string;
  expenseName: string;
  concept: string;
  expenseType: FeeRequestExpenseType;
  court: string;
  amount: number;
  requester: string;
  observation?: string;
}
