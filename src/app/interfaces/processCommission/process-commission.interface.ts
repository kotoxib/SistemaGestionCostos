export type CommissionAdvanceType = 'Advance' | 'Partial' | 'Total';
export type CommissionAdvanceState = 'Processed' | 'Cancelled';
export type CaseCommissionProfitType = 'Real' | 'Projected';
export type CaseCommissionState = 'Pending' | 'Advanced' | 'Paid';

export interface ICommissionAdvance {
  id: string;
  date: string;
  amount: number;
  type: CommissionAdvanceType;
  state: CommissionAdvanceState;
  comment?: string;
}

export interface IProcessCommission {
  id: string;
  caseNumber: string;
  clientName: string;
  responsibleAttorneyId: number;
  responsibleAttorney: string;
  date: string;
  caseAmount: number;
  paidIncome: number;
  paidPercentage: number;
  adminExpenses: number;
  profit: number;
  profitType: CaseCommissionProfitType;
  commissionPercentage: number;
  commissionAmount: number;
  advances: ICommissionAdvance[];
  advancesTotal: number;
  commissionBalance: number;
  firstInstallmentCollected: boolean;
  state: CaseCommissionState;
}
