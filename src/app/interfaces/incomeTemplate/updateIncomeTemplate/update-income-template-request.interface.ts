import { IncomeTemplateType } from '../income-template.interface';

export interface UpdateIncomeTemplateRequest {
  id: number;
  clientId: number;
  name: string;
  type: IncomeTemplateType;
  fileName?: string;
  fileBase64?: string;
}
