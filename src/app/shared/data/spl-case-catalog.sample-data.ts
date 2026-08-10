export type SplCaseEntity = 'Banco' | 'Empresa' | 'Persona Natural';

export interface SplCaseCatalogEntry {
  caseNumber: string;
  client: string;
  entity: SplCaseEntity;
  fileNumber: string;
  court: string;
  amount: number;
  currency: string;
}

/**
 * Casos judiciales de ejemplo tomados del prototipo SPL (Sistema de Procesos
 * Legales), para que al crear Ingresos/Gastos en SGC se pueda elegir el mismo
 * caso que se muestra en SPL durante una demo. `entity` refleja la misma
 * clasificación (Banco/Empresa/Natural) que usa SPL para cada cliente.
 */
export const SPL_CASE_CATALOG: SplCaseCatalogEntry[] = [
  { caseNumber: 'C-2025-0314', client: 'BCP S.A.', entity: 'Banco', fileNumber: 'FILE-2025-0087', court: '3er Juzg. Civil Lima', amount: 45000, currency: 'PEN' },
  { caseNumber: 'C-2025-0287', client: 'BCP S.A.', entity: 'Banco', fileNumber: 'FILE-2025-0061', court: '5to Juzg. Comercial Lima', amount: 89300, currency: 'PEN' },
  { caseNumber: 'C-2024-1102', client: 'BCP S.A.', entity: 'Banco', fileNumber: 'FILE-2024-0298', court: '8vo Juzg. Civil Lima', amount: 28750, currency: 'PEN' },
  { caseNumber: 'C-2024-0956', client: 'BCP S.A.', entity: 'Banco', fileNumber: 'FILE-2024-0201', court: '2do Juzg. Laboral Lima', amount: 15200, currency: 'PEN' },
  { caseNumber: 'C-2025-0401', client: 'BCP S.A.', entity: 'Banco', fileNumber: 'FILE-2025-0112', court: '4to Juzg. Comercial Lima', amount: 7600, currency: 'PEN' },
  { caseNumber: 'C-2023-0512', client: 'Inmobiliaria Pacheco S.A.C.', entity: 'Empresa', fileNumber: 'FILE-2023-0134', court: '1er Juzg. Comercial Lima', amount: 320000, currency: 'PEN' },
  { caseNumber: 'C-2023-0318', client: 'Carlos Alberto Mendoza', entity: 'Persona Natural', fileNumber: 'FILE-2023-0089', court: '3er Juzg. Laboral Lima', amount: 45800, currency: 'PEN' },
];
