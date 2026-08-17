import { inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from '../../../../models/api/ApiResponse.api';
import { DesignationApi } from '../../../../models/api/organization/designation.api';
import { finalize } from 'rxjs';
import { HttpClient, HttpContext } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { OfficeApi } from '../../../../models/api/organization/offices.api';
import type { AppError } from '../../../../models/ui/global/ErrorPresentation.ui';
import { UnitsApi } from '../../../../models/api/organization/units.api';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private http = inject(HttpClient);

  loading = signal<boolean>(false);
  error = signal<AppError | null>(null);
  units = signal<UnitsApi[]>([]);
  officesInUnit = signal<OfficeApi[]>([]);
  officesDesignations = signal<DesignationApi[]>([]);

  fetchUnits(context?: HttpContext) {
    this.loading.set(true);

    this.http.get<ApiResponse<UnitsApi[]>>(
      `${environment.api}/identity/units`,
      context ? { context } : undefined,
    )
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => this.units.set(resp.data),
        error: (err) => this.error.set(err)
      })
  }

  fetchAllOffices(unitId: string, context?: HttpContext) {
    this.loading.set(true);

    this.http
      .get<ApiResponse<OfficeApi[]>>(
        `${environment.api}/identity/${unitId}/offices`,
        context ? { context } : undefined,
      )
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => this.officesInUnit.set(resp.data),
        error: (err) => this.error.set(err),
      });
  }

  fetchAllDesignations(context?: HttpContext) {
    this.loading.set(true);

    this.http
      .get<ApiResponse<DesignationApi[]>>(
        `${environment.api}/identity/offices/designations`,
        context ? { context } : undefined,
      )
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => this.officesDesignations.set(resp.data),
        error: (err) => this.error.set(err),
      });
  }

  fetchDepartments() {

  }
}
