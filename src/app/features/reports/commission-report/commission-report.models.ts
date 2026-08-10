export type ReportCommissionState = 'Pendiente' | 'Adelantado' | 'Pagado';

export interface ReportCommissionRow {
  id: string;
  caseNumber: string;
  clientName: string;
  responsibleAttorney: string;
  commissionAmount: number;
  advancesTotal: number;
  commissionBalance: number;
  state: ReportCommissionState;
}
