import { inject, Injectable, signal } from '@angular/core';
import { CorrSubjectApi } from '../../../../../interfaces/documents/corrSubject/corrSubject.api';
import { ApiResponse } from '../../../../../interfaces/shared/ApiResponse.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CorrespondenceSubjectService {
  private http = inject(HttpClient);

  data = signal<CorrSubjectApi[]>([]);
  error = signal<any>(null);

  fetchCorrSubjects() {
    this.http.get<ApiResponse<CorrSubjectApi[]>>(`${environment.api}/document/subjects`)
    .subscribe({
        next: (resp) => this.data.set(resp.data),
        error: (err) => this.error.set(err)
    })
  }
}
