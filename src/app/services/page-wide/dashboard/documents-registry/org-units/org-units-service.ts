import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from '../../../../../interfaces/shared/ApiResponse.interface';
import { environment } from '../../../../../../environments/environment.development';
import { UnitsApi } from '../../../../../interfaces/org units/units.api';

@Injectable({
  providedIn: 'root',
})
export class OrgUnitsService {
  private http = inject(HttpClient);

  data = signal<UnitsApi[]>([]);
  error = signal<any>(null);

  fetchOrgUnits() {
    this.http.get<ApiResponse<UnitsApi[]>>(`${environment.api}/identity/units`)
    .subscribe({
        next: (resp) => this.data.set(resp.data),
        error: (err) => this.error.set(err)
    })
  }
}
