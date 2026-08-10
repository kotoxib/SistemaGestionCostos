import { FeeRequestState } from '../fee-request.interface';

export interface UpdateFeeRequestStateRequest {
  feeRequestId: number;
  state: FeeRequestState;
  observation?: string;
}
