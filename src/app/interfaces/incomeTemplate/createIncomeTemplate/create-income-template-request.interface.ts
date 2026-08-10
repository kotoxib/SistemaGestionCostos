import { IncomeTemplateType } from '../income-template.interface';

export interface CreateIncomeTemplateRequest {
  clientId: number;
  name: string;
  type: IncomeTemplateType;
  fileName: string;
  fileBase64: string;
}
