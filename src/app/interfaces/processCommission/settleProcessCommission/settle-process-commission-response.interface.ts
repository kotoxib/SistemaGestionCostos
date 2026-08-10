import { CaseCommissionState } from '../process-commission.interface';

export interface SettleProcessCommissionResponse {
  message: string;
  state: CaseCommissionState;
}
