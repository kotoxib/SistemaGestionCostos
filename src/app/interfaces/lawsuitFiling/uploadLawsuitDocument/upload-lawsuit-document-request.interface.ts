export type LawsuitDocumentKind = 'FeeDocument' | 'FinalDocument' | 'StateDocument';

export interface UploadLawsuitDocumentRequest {
  lawsuitFilingId: number;
  documentKind: LawsuitDocumentKind;
  fileName: string;
  fileBase64: string;
}
