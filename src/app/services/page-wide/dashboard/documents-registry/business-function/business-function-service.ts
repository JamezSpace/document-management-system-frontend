import { inject, Injectable, signal } from '@angular/core';
import { BussFunctionApi } from '../../../../../interfaces/documents/bussFunction/bussFunction.api';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../../../../interfaces/shared/ApiResponse.interface';
import { environment } from '../../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class BusinessFunctionService {
  private http = inject(HttpClient);

  bussFunctions = signal<BussFunctionApi[]>([]);
  error = signal<any>(null);

  fetchBussFunctions() {
    this.http.get<ApiResponse<BussFunctionApi[]>>(`${environment.api}/document/functions`)
    .subscribe({
        next: (resp) => this.bussFunctions.set(resp.data),
        error: (err) => this.error.set(err)
    })
  }
}
