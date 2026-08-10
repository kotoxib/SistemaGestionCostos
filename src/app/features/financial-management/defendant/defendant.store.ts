import { Injectable, signal } from '@angular/core';
import { DefendantRow } from './defendant.models';
import { DEFENDANT_SAMPLE_DATA } from './defendant.sample-data';

@Injectable({ providedIn: 'root' })
export class DefendantStore {
  readonly defendants = signal<DefendantRow[]>(structuredClone(DEFENDANT_SAMPLE_DATA));

  primaryDefendantFor(clientName: string): DefendantRow | null {
    return (
      this.defendants().find((d) => d.clientName === clientName && d.legalRole === 'Demandado') ?? null
    );
  }

  create(row: DefendantRow): void {
    this.defendants.update((list) => [row, ...list]);
  }

  updateById(id: number, changes: Partial<DefendantRow>): void {
    this.defendants.update((list) =>
      list.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    );
  }

  remove(id: number): void {
    this.defendants.update((list) => list.filter((item) => item.id !== id));
  }
}
