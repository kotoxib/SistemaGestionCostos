import { CaseCommissionProfitType, CaseCommissionState } from '../process-commission.interface';

export interface GetAllProcessCommissionPaginationResponse {
  id: string;
  caseNumber: string;
  clientName: string;
  responsibleAttorneyId: number;
  responsibleAttorney: string;
  caseAmount: number;
  paidPercentage: number;
  profit: number;
  profitType: CaseCommissionProfitType;
  commissionPercentage: number;
  commissionAmount: number;
  advancesTotal: number;
  commissionBalance: number;
  state: CaseCommissionState;
  date: string;
}
