import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../../../environments/environment.development';
import { ApiResponse } from '../../../../../interfaces/api/ApiResponse.interface';
import { StaffMember } from '../../../../../interfaces/staff/StaffMember.api';

@Injectable({
  providedIn: 'root',
})
export class UnitMembersService {
  private http = inject(HttpClient);

  data = signal<StaffMember[]>([]);
  error = signal<any>(null);

  fetchUnitMembers(unitId: string) {
  this.http
    .get<ApiResponse<StaffMember[]>>(`${environment.api}/identity/${unitId}/staff-members`)
    .subscribe({
      next: (resp) => this.data.set(resp.data ?? []),
      error: (err) => this.error.set(err)
    });
}
}
