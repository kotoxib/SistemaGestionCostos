export type FeeRequestExpenseType = 'Administrative' | 'Judicial';
export type FeeRequestState = 'Registered' | 'Paid' | 'Refunded' | 'Completed';

export interface IFeeRequestHistory {
  action: string;
  state: string;
  date: string;
  time: string;
  user: string;
  observation?: string;
}

export interface IFeeRequest {
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
  history: IFeeRequestHistory[];
  defendant?: string;
  fileNumber?: string;
  department?: string;
  requesterName?: string;
  observation?: string;
  isReturn?: boolean;
}
