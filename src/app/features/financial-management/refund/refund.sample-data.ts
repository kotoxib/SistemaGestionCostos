import { RefundRow } from './refund.models';

export const REFUND_SAMPLE_DATA: RefundRow[] = [
  {
    id: 1,
    caseNumber: 'CJ-2025-0001',
    clientName: 'BCP S.A.',
    totalAmount: 320.0,
    state: 'Generado',
    date: '17/04/2026',
    expenses: [
      { id: 'sa-001', requestCode: 'SGC-2025-0001', defendant: 'Rodríguez Fuentes María Elena', fileNumber: 'EXP-2025-0001', concept: 'Arancel de Demanda', expenseType: 'Judicial', amount: 320.0 },
    ],
  },
  {
    id: 2,
    caseNumber: 'CJ-2025-0002',
    clientName: 'BBVA Perú',
    totalAmount: 215.5,
    state: 'Generado',
    date: '27/03/2026',
    expenses: [
      { id: 'sa-002', requestCode: 'SGC-2025-0002', defendant: 'Torres Quispe Carlos Alberto', fileNumber: 'EXP-2025-0002', concept: 'Arancel de Apelación', expenseType: 'Judicial', amount: 215.5 },
    ],
  },
  {
    id: 3,
    caseNumber: 'CJ-2025-0006',
    clientName: 'Scotiabank',
    totalAmount: 150.0,
    state: 'Procesado',
    date: '15/03/2026',
    expenses: [
      { id: 'sa-004', requestCode: 'SGC-2025-0012', defendant: 'Vera Palacios Ana Sofía', fileNumber: 'EXP-2025-0012', concept: 'Arancel de Medida Cautelar', expenseType: 'Judicial', amount: 150.0 },
    ],
  },
];
