import { Injectable, signal } from '@angular/core';
import type { AppError } from '../../../../models/ui/global/ErrorPresentation.ui';

@Injectable({ providedIn: 'root' })
export class ErrorBannerService {
  readonly error = signal<AppError | null>(null);

  show(error: AppError): void {
    this.error.set(error);
  }

  dismiss(): void {
    this.error.set(null);
  }
}
