import { RefundState } from '../refund.interface';

export interface UpdateRefundRequest {
  id: number;
  state: RefundState;
}
