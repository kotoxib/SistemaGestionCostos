export type RefundState = 'Generated' | 'Processed' | 'Cancelled';

export interface IJudicialExpense {
  id: number;
  operation: string;
  clientName: string;
  provider: string;
  description: string;
  currency: string;
  totalAmount: number;
  requirementNumber: string;
  requirementDate: string;
  paymentDate: string;
}

export interface IRefund {
  id: number;
  caseNumber: string;
  clientId: number;
  clientName: string;
  totalAmount: number;
  state: RefundState;
  date: string;
  expenses?: IJudicialExpense[];
  selectedFeeRequestIds?: number[];
}
