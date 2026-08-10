export interface RegisterCaseIncomePaymentRequest {
  caseIncomeId: number;
  date: string;
  amount: number;
  paymentMethod: string;
  documentNumber?: string;
  observation?: string;
  attachmentName?: string;
  attachmentBase64?: string;
}
