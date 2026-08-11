import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { ApiResponse } from '../../../../models/api/ApiResponse.api';
import { CorrSubjectApi } from '../../../../models/api/documents/corrSubject/corrSubject.api';
import type { AppError } from '../../../../models/ui/global/ErrorPresentation.ui';


@Injectable({
  providedIn: 'root',
})
export class CorrespondenceSubjectService {
  private http = inject(HttpClient);

  corrSubjects = signal<CorrSubjectApi[]>([]);
  error = signal<AppError | null>(null);

  fetchCorrSubjects() {
    this.http.get<ApiResponse<CorrSubjectApi[]>>(`${environment.api}/document/subjects`)
    .subscribe({
        next: (resp) => this.corrSubjects.set(resp.data),
        error: (err) => this.error.set(err)
    })
  }
}
