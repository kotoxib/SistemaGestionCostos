import { CommissionAdvanceType } from '../process-commission.interface';

export interface RegisterCommissionAdvanceRequest {
  processCommissionId: string;
  amount: number;
  type: CommissionAdvanceType;
  comment?: string;
}
