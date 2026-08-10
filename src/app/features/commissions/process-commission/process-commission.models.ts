export type CaseCommissionState = 'Pendiente' | 'Adelantado' | 'Pagado';
export type ProfitType = 'Real' | 'Proyectada';
export type AdvanceType = 'Adelanto' | 'Parcial' | 'Total';
export type AdvanceState = 'Procesado' | 'Anulado';

export interface CommissionAdvance {
  id: string;
  date: string;
  amount: number;
  type: AdvanceType;
  state: AdvanceState;
  comment?: string;
}

export interface ProcessCommission {
  id: string;
  caseNumber: string;
  clientName: string;
  responsibleAttorney: string;
  date: string;
  caseAmount: number;
  paidIncome: number;
  paidPercentage: number;
  adminExpenses: number;
  profit: number;
  profitType: ProfitType;
  commissionPercentage: number;
  commissionAmount: number;
  advances: CommissionAdvance[];
  advancesTotal: number;
  commissionBalance: number;
  state: CaseCommissionState;
}

export interface AdvanceHistoryEntry extends CommissionAdvance {
  caseNumber: string;
  clientName: string;
}

export interface AttorneyCommissionSummary {
  attorney: string;
  totalCases: number;
  totalCommission: number;
  advancesTotal: number;
  commissionBalance: number;
}
