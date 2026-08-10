export type FeeRequestExpenseType = 'Judicial' | 'Administrativo';
export type FeeRequestState = 'Registrado' | 'Pagado' | 'Reembolsado' | 'Concluído';

export interface FeeRequestHistoryEntry {
  action: string;
  state: string;
  date: string;
  time: string;
  user: string;
  observation?: string;
}

export interface FeeRequestRow {
  id: number;
  code: string;
  date: string;
  entity: string;
  clientName: string;
  caseNumber: string;
  expenseType: FeeRequestExpenseType;
  expenseName: string;
  concept: string;
  amount: number;
  currency: string;
  state: FeeRequestState;
  defendant?: string;
  fileNumber?: string;
  requesterName?: string;
  observation?: string;
  isRefundable?: 'Sí' | 'No';
  attachmentName?: string;
  finalDocumentName?: string;
  history: FeeRequestHistoryEntry[];
}

export interface CaseCatalogEntry {
  caseNumber: string;
  client: string;
  entity: string;
  fileNumber: string;
  court: string;
}

export interface FeeTypeCatalogEntry {
  name: string;
  type: FeeRequestExpenseType;
}
