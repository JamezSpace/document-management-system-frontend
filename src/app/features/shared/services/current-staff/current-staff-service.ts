import { inject, Injectable, signal } from '@angular/core';
import { HttpContext } from '@angular/common/http';

import { StaffLoginApi } from '../../../../models/api/staff/StaffLogin.api';
import { AppError } from '../../../../models/ui/global/ErrorPresentation.ui';
import { ERROR_SURFACE } from '../../../../core/interceptors/error/error-context';
import { ErrorSurface } from '../../../../enums/global/errorSurface.enum';
import { AppContextService } from '../../../../core/services/app-context/app-context.service';

@Injectable({
  providedIn: 'root',
})
export class CurrentStaffService {
  private readonly appContext = inject(AppContextService);

  readonly data = this.appContext.actor;
  readonly error = signal<AppError | null>(null);
  readonly loading = signal(false);

  async loadCurrentStaff(): Promise<StaffLoginApi> {
    this.loading.set(true);
    this.error.set(null);

    try {
      return await this.appContext.load(
        new HttpContext().set(ERROR_SURFACE, ErrorSurface.SILENT),
      );
    } catch (error) {
      const appError = error as AppError;
      this.error.set(appError);
      throw appError;
    } finally {
      this.loading.set(false);
    }
  }

  hasCapability(capability: string): boolean {
    return this.appContext.can(capability);
  }

  resetContext(): void {
    this.appContext.reset();
    this.error.set(null);
    this.loading.set(false);
  }
}
