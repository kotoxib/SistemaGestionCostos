import { IncomeTemplateType } from '../income-template.interface';

export interface GetAllIncomeTemplatePaginationResponse {
  id: number;
  clientName: string;
  name: string;
  type: IncomeTemplateType;
  fileName: string;
  uploadDate: string;
  uploadedBy: string;
}
