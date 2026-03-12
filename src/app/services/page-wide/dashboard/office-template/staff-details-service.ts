import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StaffDetailsService {
  private http = inject(HttpClient);

  data = signal<any>(null);
  error = signal<any>(null);
  loading = signal<boolean>(false);

  fetchStaffDetailsForLogin() {
    this.loading.set(true);

    this.http
      .get(`${environment.api}/identity/staff/me`)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => this.data.set(response),
        error: (err) => this.error.set(err)
      });
  }
}
