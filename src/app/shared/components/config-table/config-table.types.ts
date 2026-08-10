export type ConfigTableCellType = 'text' | 'badge';
export type ConfigTableAlign = 'left' | 'center' | 'right';
export type ConfigTableTooltipPosition = 'auto' | 'top' | 'bottom' | 'left' | 'right';
export type ConfigTableIconType = 'prime' | 'material';

export interface ConfigTableBadgeOption {
  label?: string;
  class: string;
}

export interface ConfigTableColumn<T = unknown> {
  field: keyof T & string | string;
  header: string;

  type?: ConfigTableCellType;

  width?: string;
  minWidth?: string;

  /**
   * Opcional:
   * align: 'center' centra la columna.
   * align: 'right' alinea a la derecha.
   * Si no se coloca, queda a la izquierda.
   */
  align?: ConfigTableAlign;

  /**
   * Opcional:
   * bold: true coloca la columna en negrita.
   */
  bold?: boolean;

  /**
   * Opcional:
   * nowrap: true evita salto de línea.
   */
  nowrap?: boolean;

  headerClass?: string;
  cellClass?: string | ((row: T, value: unknown, rowIndex: number) => string);

  /**
   * Por defecto está apagado.
   * Solo se activa si colocas tooltip: true.
   */
  tooltip?: boolean;

  /**
   * Por defecto es auto.
   */
  tooltipPosition?: ConfigTableTooltipPosition;

  /**
   * Campo alternativo para mostrar en el tooltip.
   */
  tooltipField?: keyof T & string | string;

  /**
   * Texto personalizado para tooltip.
   */
  tooltipGetter?: (row: T, value: unknown, rowIndex: number) => string;

  /**
   * Para columnas tipo badge.
   */
  badgeMap?: Record<string, ConfigTableBadgeOption>;

  /**
   * Permite mostrar un valor calculado.
   */
  valueGetter?: (row: T, rowIndex: number) => unknown;

  /**
   * Permite formatear el valor final.
   */
  formatter?: (value: unknown, row: T, rowIndex: number) => string;
}

export interface ConfigTableActionEvent<T = unknown> {
  row: T;
  rowIndex: number;
  action: ConfigTableAction<T>;
  originalEvent: MouseEvent;
}

export interface ConfigTableAction<T = unknown> {
  key: string;

  /**
   * PrimeIcons:
   * icon: 'pi pi-pencil'
   * iconType: 'prime'
   *
   * Material Symbols:
   * icon: 'edit'
   * iconType: 'material'
   */
  icon: string;
  iconType?: ConfigTableIconType;

  tooltip?: string | ((row: T, rowIndex: number) => string);
  tooltipPosition?: ConfigTableTooltipPosition;

  styleClass?: string;
  ariaLabel?: string;

  visible?: (row: T, rowIndex: number) => boolean;
  disabled?: (row: T, rowIndex: number) => boolean;

  onClick: (event: ConfigTableActionEvent<T>) => void;
}
