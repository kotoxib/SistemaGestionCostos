import { FeeRequestExpenseType } from '../fee-request.interface';

export interface UpdateFeeRequestRequest {
  id: number;
  entity: string;
  bank: string;
  caseNumber: string;
  expenseType: FeeRequestExpenseType;
  expenseName: string;
  concept: string;
  amount: number;
  defendant?: string;
  fileNumber?: string;
  department?: string;
  requesterName?: string;
  observation?: string;
}
