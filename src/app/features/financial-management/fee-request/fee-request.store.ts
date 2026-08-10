import { Injectable, signal } from '@angular/core';
import { FeeRequestRow } from './fee-request.models';
import { FEE_REQUEST_SAMPLE_DATA } from './fee-request.sample-data';

@Injectable({ providedIn: 'root' })
export class FeeRequestStore {
  readonly feeRequests = signal<FeeRequestRow[]>(structuredClone(FEE_REQUEST_SAMPLE_DATA));

  reimbursableByCase(caseNumber: string): FeeRequestRow[] {
    return this.feeRequests().filter(
      (row) =>
        row.caseNumber === caseNumber &&
        row.expenseType === 'Judicial' &&
        row.isRefundable === 'Sí' &&
        !!row.finalDocumentName,
    );
  }

  create(row: FeeRequestRow): void {
    this.feeRequests.update((list) => [row, ...list]);
  }

  updateById(id: number, changes: Partial<FeeRequestRow>): void {
    this.feeRequests.update((list) =>
      list.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    );
  }

  remove(id: number): void {
    this.feeRequests.update((list) => list.filter((item) => item.id !== id));
  }

  markAsRefunded(ids: (number | undefined)[]): void {
    const idSet = new Set(ids.filter((id): id is number => id !== undefined));
    if (idSet.size === 0) return;

    const now = new Date();
    const time = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString('es-PE');

    this.feeRequests.update((list) =>
      list.map((item) =>
        idSet.has(item.id)
          ? {
              ...item,
              state: 'Reembolsado' as const,
              history: [
                ...item.history,
                { action: 'Reembolso aprobado', state: 'Reembolsado', date, time, user: 'Administrador' },
              ],
            }
          : item,
      ),
    );
  }
}
