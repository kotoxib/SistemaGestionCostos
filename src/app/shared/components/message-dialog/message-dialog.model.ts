export type ModalType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

export interface ModalConfig {
  type: ModalType;
  title: string;
  message: string;
  hint?: string;

  confirmText?: string;
  cancelText?: string;

  showCancel?: boolean;
}

export interface ModalResult {
  confirmed: boolean;
}
