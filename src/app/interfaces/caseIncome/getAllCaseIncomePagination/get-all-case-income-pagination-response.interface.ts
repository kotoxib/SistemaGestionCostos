import { CaseIncomeState } from '../case-income.interface';

export interface GetAllCaseIncomePaginationResponse {
  id: number;
  incomeNumber: string;
  caseNumber: string;
  clientName: string;
  currency: string;
  caseAmount: number;
  paidAmount: number;
  balance: number;
  paidPercentage: number;
  state: CaseIncomeState;
  lastPaymentDate?: string;
}
