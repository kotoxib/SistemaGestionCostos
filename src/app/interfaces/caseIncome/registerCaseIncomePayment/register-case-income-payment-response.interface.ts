import { ICaseIncomePayment } from '../case-income.interface';

export interface RegisterCaseIncomePaymentResponse {
  message: string;
  payment: ICaseIncomePayment;
  paidAmount: number;
  balance: number;
  paidPercentage: number;
}
