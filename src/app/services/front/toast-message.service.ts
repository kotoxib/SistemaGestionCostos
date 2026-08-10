import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastMessageService {
  private messageService = inject(MessageService);

  showSuccess(message: string) {
    this.messageService.add({
      severity: 'success',
      detail: message,
    });
  }

  showErrorHight(message: string) {
    this.messageService.add({ severity: 'error', detail: message });
  }

  showErrorInfo(message: string) {
    this.messageService.add({ severity: 'info', detail: message });
  }

  showWarning(message: string) {
    this.messageService.add({ severity: 'warn', detail: message });
  }
}
