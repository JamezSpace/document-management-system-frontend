import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { UtilService } from '../../../../system-wide/util-service/util-service';
import { NoticesApi } from '../../../../../interfaces/api/notices/notices.api';
import { ErrorType } from '../../../../../interfaces/api/Error.interface';
import { ApiResponse } from '../../../../../interfaces/api/ApiResponse.interface';
import { environment } from '../../../../../../environments/environment.development';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NoticesService {
  private http = inject(HttpClient);
  private utilService = inject(UtilService);

  notices = signal<NoticesApi[]>([]);
  loading = signal<boolean>(false);
  error = signal<ErrorType | null>(null);

  fetchNotices(staffId: string) {
    this.loading.set(true);

    this.http.get<ApiResponse<NoticesApi[]>>(`${environment.api}/notifications/${staffId}`)
    .pipe(finalize(() => this.loading.set(false)))
    .subscribe({
        next: (resp) => this.notices.set(resp.data),
        error: (err) => this.error.set(err)
    })
  }
}
