import { ProcessCommission } from './process-commission.models';

function buildProcess(
  id: string,
  caseNumber: string,
  clientName: string,
  responsibleAttorney: string,
  date: string,
  caseAmount: number,
  paidIncome: number,
  adminExpenses: number,
  commissionAmount: number,
  profitType: ProcessCommission['profitType'],
  advances: ProcessCommission['advances'],
): ProcessCommission {
  const advancesTotal = advances.reduce((sum, a) => sum + a.amount, 0);
  const paidPercentage = caseAmount > 0 ? Math.round((paidIncome / caseAmount) * 100) : 0;
  const commissionBalance = Math.max(commissionAmount - advancesTotal, 0);
  const state: ProcessCommission['state'] =
    commissionBalance === 0 ? 'Pagado' : advancesTotal > 0 ? 'Adelantado' : 'Pendiente';

  return {
    id,
    caseNumber,
    clientName,
    responsibleAttorney,
    date,
    caseAmount,
    paidIncome,
    paidPercentage,
    adminExpenses,
    profit: caseAmount - adminExpenses,
    profitType,
    commissionPercentage: 20,
    commissionAmount,
    advances,
    advancesTotal,
    commissionBalance,
    state,
  };
}

export const PROCESS_COMMISSION_SAMPLE_DATA: ProcessCommission[] = [
  buildProcess('com-001', 'CJ-2025-0001', 'BCP S.A.', 'M. Rodríguez', '2026-01-15', 46000, 23000, 300, 9200, 'Proyectada', []),
  buildProcess('com-002', 'CJ-2025-0002', 'BBVA Perú', 'M. Rodríguez', '2026-01-15', 30000, 0, 200, 6000, 'Proyectada', []),
  buildProcess('com-003', 'CJ-2025-0003', 'Interbank', 'C. Pérez', '2026-01-20', 74000, 74000, 400, 14750.5, 'Real', [
    { id: 'ADV-001', date: '10/01/2026', amount: 8000, type: 'Parcial', state: 'Procesado' },
  ]),
  buildProcess('com-004', 'CJ-2025-0004', 'Banco Pichincha', 'C. Pérez', '2026-01-20', 40000, 40000, 250, 8000, 'Real', [
    { id: 'ADV-002', date: '18/01/2026', amount: 4000, type: 'Parcial', state: 'Procesado' },
  ]),
  buildProcess('com-005', 'CJ-2025-0005', 'Scotiabank', 'A. López', '2026-01-10', 95000, 95000, 500, 18900, 'Real', [
    { id: 'ADV-003', date: '05/01/2026', amount: 8900, type: 'Parcial', state: 'Procesado' },
    { id: 'ADV-004', date: '12/01/2026', amount: 10000, type: 'Total', state: 'Procesado' },
  ]),
  buildProcess('com-006', 'CJ-2025-0006', 'Banco de Crédito', 'J. García', '2026-01-22', 49000, 0, 200, 9800, 'Proyectada', []),
  buildProcess('com-007', 'CJ-2025-0007', 'BCP S.A.', 'R. Fernández', '2026-01-25', 87000, 87000, 450, 17400.75, 'Real', [
    { id: 'ADV-005', date: '08/01/2026', amount: 10000, type: 'Parcial', state: 'Procesado' },
  ]),
  buildProcess('com-008', 'CJ-2025-0008', 'BBVA Perú', 'R. Fernández', '2026-01-25', 50000, 25000, 300, 10000, 'Proyectada', [
    { id: 'ADV-006', date: '15/01/2026', amount: 5000, type: 'Parcial', state: 'Procesado' },
  ]),
];
