export type RefundState = 'Generado' | 'Procesado' | 'Anulado';

export interface RefundExpenseRow {
  id: string;
  feeRequestId?: number;
  requestCode: string;
  defendant: string;
  fileNumber: string;
  concept: string;
  expenseType: string;
  amount: number;
}

export interface RefundRow {
  id: number;
  caseNumber: string;
  clientName: string;
  defendantName?: string;
  templateFileName?: string;
  totalAmount: number;
  state: RefundState;
  date: string;
  expenses: RefundExpenseRow[];
}

export interface EmailContact {
  name: string;
  email: string;
  checked: boolean;
}
