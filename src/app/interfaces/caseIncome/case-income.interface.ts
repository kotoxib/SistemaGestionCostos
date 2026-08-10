export type CaseIncomeState = 'Paid' | 'InProgress' | 'NoPayments';

export interface ICaseIncomePayment {
  id: string;
  date: string;
  amount: number;
  paymentMethod: string;
  documentNumber?: string;
  observation?: string;
  attachmentName?: string;
}

export interface ICaseIncome {
  id: number;
  incomeNumber: string;
  caseNumber: string;
  clientId: number;
  clientName: string;
  currency: string;
  caseAmount: number;
  paidAmount: number;
  balance: number;
  paidPercentage: number;
  state: CaseIncomeState;
  lastPaymentDate?: string;
  responsible: string;
  payments: ICaseIncomePayment[];
}
