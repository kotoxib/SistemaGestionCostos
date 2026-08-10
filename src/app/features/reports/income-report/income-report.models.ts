export type ReportIncomeState = 'Pagado' | 'En proceso' | 'Sin pagos';

export interface ReportIncomeRow {
  incomeNumber: string;
  caseNumber: string;
  clientName: string;
  currency: string;
  caseAmount: number;
  paidAmount: number;
  balance: number;
  paidPercentage: number;
  state: ReportIncomeState;
  lastPaymentDate: string | null;
}
