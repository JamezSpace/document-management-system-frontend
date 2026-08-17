import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { ApiResponse } from '../../../../models/api/ApiResponse.api';
import type { AppError } from '../../../../models/ui/global/ErrorPresentation.ui';
import { StaffMember } from '../../../../models/api/staff/StaffMember.api';


@Injectable({
  providedIn: 'root',
})
export class UnitMembersService {
  private http = inject(HttpClient);

  data = signal<StaffMember[]>([]);
  error = signal<AppError | null>(null);

  fetchUnitMembers(unitId: string, context?: HttpContext) {
  this.http
    .get<ApiResponse<StaffMember[]>>(
      `${environment.api}/identity/${unitId}/staff-members`,
      context ? { context } : undefined,
    )
    .subscribe({
      next: (resp) => this.data.set(resp.data ?? []),
      error: (err) => this.error.set(err)
    });
}
}
