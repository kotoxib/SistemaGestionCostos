import { FeeRequestExpenseType, FeeRequestState } from '@interfaces/feeRequest';

export interface ILawsuitFiling {
  id: number;
  code: string;
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
  date: string;
  state: FeeRequestState;
  expenseRegistered: boolean;
  feeDocumentName?: string;
  finalDocument: boolean;
  finalDocumentName?: string;
  finalState: boolean;
  stateDocumentName?: string;
}
