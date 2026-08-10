export type IncomeTemplateType = 'Refund' | 'FileTable';

export interface IIncomeTemplate {
  id: number;
  clientId: number;
  clientName: string;
  name: string;
  type: IncomeTemplateType;
  fileName: string;
  uploadDate: string;
  uploadedBy: string;
}
