export type CaseIncomeState = 'Pagado' | 'En proceso' | 'Sin pagos';

export interface CaseOption {
  id: string;
  client: string;
  amount: number;
  currency: string;
}

export interface IncomePayment {
  id: string;
  date: string;
  amount: number;
  paymentMethod: string;
  user: string;
  documentNumber?: string;
  observation?: string;
  attachmentName?: string;
}

export interface CaseIncomeRow {
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
  lastPaymentDate: string | null;
  responsible: string;
  payments: IncomePayment[];
}
