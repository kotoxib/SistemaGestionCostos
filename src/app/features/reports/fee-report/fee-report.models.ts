export type ReportExpenseType = 'Judicial' | 'Administrativo';
export type ReportFeeState = 'Registrado' | 'Pagado' | 'Reembolsado' | 'Concluído';

export interface ReportFeeRow {
  code: string;
  date: string;
  clientName: string;
  caseNumber: string;
  expenseType: ReportExpenseType;
  expenseName: string;
  amount: number;
  state: ReportFeeState;
}
