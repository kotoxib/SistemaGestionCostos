import { ICommissionAdvance } from '../process-commission.interface';

export interface RegisterCommissionAdvanceResponse {
  message: string;
  advance: ICommissionAdvance;
}
