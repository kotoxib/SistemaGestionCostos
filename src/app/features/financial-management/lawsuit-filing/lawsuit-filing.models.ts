export type LawsuitExpenseType = 'Judicial' | 'Administrativo';
export type LawsuitState = 'Registrado' | 'Pagado' | 'Reembolsado' | 'Concluído';

export interface LawsuitFilingRow {
  id: number;
  code: string;
  clientName: string;
  caseNumber: string;
  fileNumber: string;
  expenseName: string;
  concept: string;
  expenseType: LawsuitExpenseType;
  court: string;
  amount: number;
  requester: string;
  observation?: string;
  date: string;
  state: LawsuitState;
  expenseRecordLoaded: boolean;
  expenseRecordFileName?: string;
  finalDocumentLoaded: boolean;
  finalDocumentFileName?: string;
  finalStateChecked: boolean;
  stateDocumentFileName?: string;
}

export interface BulkPreviewRow {
  code: string;
  caseNumber: string;
  clientName: string;
  concept: string;
  fileName: string;
  found: boolean;
}

export type BulkUploadKind = 'expenseRecord' | 'finalDocument';
