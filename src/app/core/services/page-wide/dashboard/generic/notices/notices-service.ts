import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { environment } from '../../../../../../../environments/environment.development';
import { ApiResponse } from '../../../../../../models/api/ApiResponse.api';
import type { AppError } from '../../../../../../models/ui/global/ErrorPresentation.ui';
import { NoticesApi } from '../../../../../../models/api/notices/notices.api';
import { UtilService } from '../../../../../../shared/utils/service/util-service';

@Injectable({
  providedIn: 'root',
})
export class NoticesService {
  private http = inject(HttpClient);
  private utilService = inject(UtilService);

  notices = signal<NoticesApi[]>([]);
  loading = signal<boolean>(false);
  error = signal<AppError | null>(null);

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
