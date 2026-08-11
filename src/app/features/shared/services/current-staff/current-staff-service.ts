import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom, finalize, tap } from 'rxjs';
import { HttpContext } from '@angular/common/http';

import { ApiResponse } from '../../../../models/api/ApiResponse.api';
import {
  StaffContextApi,
  StaffLoginApi,
} from '../../../../models/api/staff/StaffLogin.api';
import { AppError } from '../../../../models/ui/global/ErrorPresentation.ui';
import { environment } from '../../../../../environments/environment.development';
import { ERROR_SURFACE } from '../../../../core/interceptors/error/error-context';
import { ErrorSurface } from '../../../../enums/global/errorSurface.enum';

@Injectable({
  providedIn: 'root',
})
export class CurrentStaffService {
  private readonly http = inject(HttpClient);

  readonly data = signal<StaffLoginApi | null>(null);
  readonly error = signal<AppError | null>(null);
  readonly loading = signal(false);

  private readonly capabilities = computed(
    () => this.data()?.authority.capabilities ?? [],
  );

  async loadCurrentStaff(): Promise<StaffLoginApi> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const response = await firstValueFrom(
        this.http
          .get<ApiResponse<StaffContextApi>>(
            `${environment.api}/identity/staff/me`,
            {
              context: new HttpContext().set(
                ERROR_SURFACE,
                ErrorSurface.SILENT,
              ),
            },
          )
          .pipe(
            tap((response) => {
              this.data.set({
                ...response.data.staff,
                authority: response.data.authority,
              });
            }),
            finalize(() => this.loading.set(false)),
          ),
      );

      return {
        ...response.data.staff,
        authority: response.data.authority,
      };
    } catch (error) {
      const appError = error as AppError;
      this.error.set(appError);
      throw appError;
    }
  }

  hasCapability(capability: string): boolean {
    return this.capabilities().includes(capability);
  }

  resetContext(): void {
    this.data.set(null);
    this.error.set(null);
    this.loading.set(false);
  }
}
