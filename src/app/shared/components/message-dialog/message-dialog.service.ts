import { Injectable, ApplicationRef, createComponent, EnvironmentInjector, inject } from '@angular/core';
import { MessageDialog } from './message-dialog';
import { ModalConfig, ModalResult } from './message-dialog.model';

@Injectable({ providedIn: 'root' })
export class MessageDialogService {
  private readonly appRef = inject(ApplicationRef);
  private readonly injector = inject(EnvironmentInjector);

  open(config: ModalConfig): Promise<ModalResult> {
    return new Promise((resolve) => {
      const componentRef = createComponent(MessageDialog, {
        environmentInjector: this.injector,
      });

      componentRef.instance.config = config;

      componentRef.instance.closeEvent.subscribe((result: ModalResult) => {
        resolve(result);

        this.appRef.detachView(componentRef.hostView);
        componentRef.destroy();
      });

      document.body.appendChild(componentRef.location.nativeElement);
      this.appRef.attachView(componentRef.hostView);
    });
  }

  success(title: string, message: string) {
    return this.open({ type: 'success', title, message, showCancel: false });
  }

  error(title: string, message: string) {
    return this.open({ type: 'error', title, message, showCancel: false });
  }

  info(title: string, message: string) {
    return this.open({ type: 'info', title, message, showCancel: false });
  }

  warning(title: string, message: string) {
    return this.open({ type: 'warning', title, message, showCancel: false });
  }

  confirm(title: string, message: string) {
    return this.open({
      type: 'confirm',
      title,
      message,
      showCancel: true,
      confirmText: 'Aceptar',
      cancelText: 'Cancelar',
    });
  }

  confirmWarning(
    title: string,
    message: string,
    hint = 'Solo use esta opción si el registro fue creado por error o está duplicado.',
  ) {
    return this.open({
      type: 'warning',
      title,
      message,
      hint,
      showCancel: true,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
    });
  }
}
