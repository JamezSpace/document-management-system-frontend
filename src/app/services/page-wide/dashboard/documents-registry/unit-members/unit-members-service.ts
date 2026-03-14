import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { StaffMember } from '../../../../../interfaces/users/office/staff/StaffMember.api';
import { ApiResponse } from '../../../../../interfaces/shared/ApiResponse.interface';
import { environment } from '../../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UnitMembersService {
  private http = inject(HttpClient);

  data = signal<StaffMember[]>([]);
  error = signal<any>(null);

  fetchUnitMembers(unitId: string) {
  this.http
    .get<ApiResponse<StaffMember[]>>(`${environment.api}/identity/${unitId}/staff`)
    .subscribe({
      next: (resp) => this.data.set(resp.data ?? []),
      error: (err) => this.error.set(err)
    });
}
}
