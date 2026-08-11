import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { ApiResponse } from '../../../../models/api/ApiResponse.api';
import { BussFunctionApi } from '../../../../models/api/documents/bussFunction/bussFunction.api';
import type { AppError } from '../../../../models/ui/global/ErrorPresentation.ui';


@Injectable({
  providedIn: 'root',
})
export class BusinessFunctionService {
  private http = inject(HttpClient);

  bussFunctions = signal<BussFunctionApi[]>([]);
  error = signal<AppError | null>(null);

  fetchBussFunctions() {
    this.http.get<ApiResponse<BussFunctionApi[]>>(`${environment.api}/document/functions`)
    .subscribe({
        next: (resp) => this.bussFunctions.set(resp.data),
        error: (err) => this.error.set(err)
    })
  }
}
