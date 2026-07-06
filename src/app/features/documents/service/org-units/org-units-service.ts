import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { ApiResponse } from '../../../../models/api/ApiResponse.interface';
import { ErrorType } from '../../../../models/api/Error.interface';
import { UnitsApi } from '../../../../models/api/org units/units.api';


@Injectable({
  providedIn: 'root',
})
export class OrgUnitsService {
  private http = inject(HttpClient);

  units = signal<UnitsApi[]>([]);
  error = signal<ErrorType | null>(null);

  fetchOrgUnits() {
    this.http.get<ApiResponse<UnitsApi[]>>(`${environment.api}/identity/units`)
    .subscribe({
        next: (resp) => this.units.set(resp.data),
        error: (err) => this.error.set(err)
    })
  }
}
