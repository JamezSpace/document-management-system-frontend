import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../../../environments/environment.development';
import { ApiResponse } from '../../../../../interfaces/api/ApiResponse.interface';
import { UnitsApi } from '../../../../../interfaces/org units/units.api';

@Injectable({
  providedIn: 'root',
})
export class OrgUnitsService {
  private http = inject(HttpClient);

  units = signal<UnitsApi[]>([]);
  error = signal<any>(null);

  fetchOrgUnits() {
    this.http.get<ApiResponse<UnitsApi[]>>(`${environment.api}/identity/units`)
    .subscribe({
        next: (resp) => this.units.set(resp.data),
        error: (err) => this.error.set(err)
    })
  }
}
