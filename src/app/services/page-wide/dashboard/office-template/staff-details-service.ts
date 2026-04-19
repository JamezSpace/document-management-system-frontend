import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { ApiResponse } from '../../../../interfaces/api/ApiResponse.interface';
import { StaffLoginApi } from '../../../../interfaces/staff/StaffLogin.api';
import { AuthService } from '../../auth/auth-service';

@Injectable({
  providedIn: 'root',
})
export class StaffDetailsService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  data = signal<StaffLoginApi | null>(null);
  error = signal<any>(null);
  loading = signal<boolean>(false);

  fetchStaffDetailsForLogin() {
    this.loading.set(true);

    this.http
      .get<ApiResponse<StaffLoginApi>>(`${environment.api}/identity/staff/me`)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
            this.data.set(response.data)

            this.authService.loadUserContext(response.data)
        },
        error: (err) => this.error.set(err)
      });
  }
}
