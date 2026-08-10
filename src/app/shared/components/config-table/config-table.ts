import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ConfigTableAction,
  ConfigTableColumn,
} from './config-table.types';
import type { TableLazyLoadEvent } from 'primeng/table';
import { PRIMENG_MODULES } from '../primeng';
import { CommonModule } from '@angular/common';

type PrimeTooltipPosition = 'top' | 'bottom' | 'left' | 'right' | undefined;

@Component({
  selector: 'app-config-table',
  standalone: true,
  imports: [...PRIMENG_MODULES, CommonModule],
  templateUrl: './config-table.html',
  styleUrl: './config-table.scss',
})
export class ConfigTableComponent<T = unknown> {
  @Input() rows: T[] = [];
  @Input() columns: ConfigTableColumn<T>[] = [];
  @Input() actions: ConfigTableAction<T>[] = [];

  @Input() loading = false;
  @Input() emptyMessage = 'No se encontraron registros.';

  @Input() actionHeader = 'Acción';
  @Input() actionColumnWidth = '130px';
  @Input() actionColumnClass = 'txt-center';

  @Input() tableStyleClass = '';

  // Paginador apagado por defecto
  @Input() paginator = false;
  @Input() rowsPerPage = 10;
  @Input() rowsPerPageOptions: number[] = [10, 20, 50];

  @Input() lazy = false;
  @Input() totalRecords = 0;
  @Input() first = 0;

  @Input() sortField: string | null = null;
  @Input() sortOrder = 1;

  @Output() lazyLoad = new EventEmitter<TableLazyLoadEvent>();

  get hasActions(): boolean {
    return this.actions.length > 0;
  }

  get totalColumns(): number {
    return this.columns.length + (this.hasActions ? 1 : 0);
  }

  get resolvedTotalRecords(): number {
    return this.lazy ? this.totalRecords : this.rows.length;
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    if (!this.lazy) {
      return;
    }

    this.lazyLoad.emit(event);
  }

  getValue(row: T, column: ConfigTableColumn<T>, rowIndex: number): unknown {
    if (column.valueGetter) {
      return column.valueGetter(row, rowIndex);
    }

    return this.resolvePath(row, column.field);
  }

  getDisplayValue(row: T, column: ConfigTableColumn<T>, rowIndex: number): string {
    const value = this.getValue(row, column, rowIndex);

    if (column.formatter) {
      return column.formatter(value, row, rowIndex);
    }

    if (value === null || value === undefined || value === '') {
      return '-';
    }

    return String(value);
  }

  getTooltip(row: T, column: ConfigTableColumn<T>, rowIndex: number): string {
    if (!column.tooltip) return '';

    const value = this.getValue(row, column, rowIndex);

    if (column.tooltipGetter) {
      return column.tooltipGetter(row, value, rowIndex);
    }

    if (column.tooltipField) {
      const tooltipValue = this.resolvePath(row, column.tooltipField);

      return tooltipValue === null || tooltipValue === undefined
        ? ''
        : String(tooltipValue);
    }

    return this.getDisplayValue(row, column, rowIndex);
  }

  getTooltipPosition(column: ConfigTableColumn<T>): PrimeTooltipPosition {
    const position = column.tooltipPosition ?? 'auto';
    return position === 'auto' ? undefined : position;
  }

  getHeaderClass(column: ConfigTableColumn<T>): string {
    const classes = ['config-table-th'];

    if (column.align === 'center') classes.push('txt-center');
    if (column.align === 'right') classes.push('txt-right');
    if (column.headerClass) classes.push(column.headerClass);

    return classes.join(' ');
  }

  getCellClass(row: T, column: ConfigTableColumn<T>, rowIndex: number): string {
    const value = this.getValue(row, column, rowIndex);
    const classes = ['config-table-td'];

    if (column.align === 'center') classes.push('txt-center');
    if (column.align === 'right') classes.push('txt-right');
    if (column.bold) classes.push('cell-bold');
    if (column.nowrap) classes.push('cell-nowrap');

    if (typeof column.cellClass === 'string') {
      classes.push(column.cellClass);
    }

    if (typeof column.cellClass === 'function') {
      const customClass = column.cellClass(row, value, rowIndex);

      if (customClass) {
        classes.push(customClass);
      }
    }

    return classes.join(' ');
  }

  getBadgeLabel(row: T, column: ConfigTableColumn<T>, rowIndex: number): string {
    const value = this.getValue(row, column, rowIndex);
    const badge = column.badgeMap?.[String(value)];

    return badge?.label ?? this.getDisplayValue(row, column, rowIndex);
  }

  getBadgeClass(row: T, column: ConfigTableColumn<T>, rowIndex: number): string {
    const value = this.getValue(row, column, rowIndex);
    const badge = column.badgeMap?.[String(value)];

    return ['config-badge', badge?.class ?? 'badge-default'].join(' ');
  }

  isActionVisible(action: ConfigTableAction<T>, row: T, rowIndex: number): boolean {
    return action.visible ? action.visible(row, rowIndex) : true;
  }

  isActionDisabled(action: ConfigTableAction<T>, row: T, rowIndex: number): boolean {
    return action.disabled ? action.disabled(row, rowIndex) : false;
  }

  getActionClass(action: ConfigTableAction<T>): string {
    return ['btn-icon', action.styleClass ?? 'btn-view'].join(' ');
  }

  getActionTooltip(action: ConfigTableAction<T>, row: T, rowIndex: number): string {
    if (!action.tooltip) return '';

    if (typeof action.tooltip === 'function') {
      return action.tooltip(row, rowIndex);
    }

    return action.tooltip;
  }

  getActionTooltipPosition(action: ConfigTableAction<T>): PrimeTooltipPosition {
    const position = action.tooltipPosition ?? 'auto';
    return position === 'auto' ? undefined : position;
  }

  handleActionClick(
    originalEvent: MouseEvent,
    action: ConfigTableAction<T>,
    row: T,
    rowIndex: number
  ): void {
    originalEvent.stopPropagation();

    if (this.isActionDisabled(action, row, rowIndex)) return;

    action.onClick({
      row,
      rowIndex,
      action,
      originalEvent,
    });
  }

  private resolvePath(row: T, path: string): unknown {
    if (!row || !path) return undefined;

    return path.split('.').reduce<unknown>((current, key) => {
      if (current === null || current === undefined) return undefined;

      return (current as Record<string, unknown>)[key];
    }, row);
  }
}
