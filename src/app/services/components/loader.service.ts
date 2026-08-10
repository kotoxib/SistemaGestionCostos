import { inject, Injectable } from '@angular/core';
import { SpinnerVisibilityService } from 'ng-http-loader';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private readonly spinner = inject(SpinnerVisibilityService);

  show(): void {
    this.spinner.show();
  }

  hide(): void {
    this.spinner.hide();
  }
}
