import { IFeeRequestHistory } from '../fee-request.interface';

export interface UpdateFeeRequestStateResponse {
  message: string;
  historyEntry: IFeeRequestHistory;
}
