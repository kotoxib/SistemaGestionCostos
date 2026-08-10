export type ReportRefundState = 'Generado' | 'Procesado' | 'Anulado';

export interface ReportRefundRow {
  caseNumber: string;
  clientName: string;
  totalAmount: number;
  state: ReportRefundState;
  date: string;
}
