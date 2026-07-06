import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { ApiResponse } from '../../../../models/api/ApiResponse.interface';
import { InitMinutePayload, MinuteApi } from '../../../../models/api/documents/minute/minutes.api';
import { ErrorType } from '../../../../models/api/Error.interface';

@Injectable({
  providedIn: 'root',
})
export class MinutesService {
  private http = inject(HttpClient);

  minutes = signal<MinuteApi[]>([]);
  minute = signal<MinuteApi | null>(null);
  loading = signal<boolean>(false);
  error = signal<ErrorType | null>(null);

  addMinuteToCorrespondence(docId: string, payload: InitMinutePayload){
    this.loading.set(true);
    
    this.http
      .post<ApiResponse<MinuteApi>>(`${environment.api}/document/documents/${docId}/minutes`, payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => {
            this.minute.set(resp.data)
            this.minutes.update(prev => [...prev, resp.data])
        },
        error: (err) => this.error.set(err),
      });
  }

  fetchMinutesForCorrespondence(docId: string) {
    this.loading.set(true);

    this.http
      .get<ApiResponse<MinuteApi[]>>(`${environment.api}/document/documents/${docId}/minutes`)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => this.minutes.set(resp.data),
        error: (err) => this.error.set(err),
      });
  }
}
