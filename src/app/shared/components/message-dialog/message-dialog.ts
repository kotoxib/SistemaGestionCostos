import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalConfig, ModalResult } from './message-dialog.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-dialog',
  imports: [CommonModule],
  templateUrl: './message-dialog.html',
  styleUrl: './message-dialog.scss',
})
export class MessageDialog {
  @Input() config!: ModalConfig;
  @Output() closeEvent = new EventEmitter<ModalResult>();

  close(confirmed: boolean) {
    this.closeEvent.emit({ confirmed });
  }

  get icon(): string {
    switch (this.config.type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      case 'confirm': return 'help';
      default: return 'info';
    }
  }
}
