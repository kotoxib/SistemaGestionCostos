export interface CreateRefundRequest {
  caseNumber: string;
  clientId: number;
  selectedFeeRequestIds: number[];
}
