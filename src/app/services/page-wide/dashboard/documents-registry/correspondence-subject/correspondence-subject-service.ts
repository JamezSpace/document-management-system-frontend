import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../../../environments/environment.development';
import { ApiResponse } from '../../../../../interfaces/api/ApiResponse.interface';
import { CorrSubjectApi } from '../../../../../interfaces/documents/corrSubject/corrSubject.api';

@Injectable({
  providedIn: 'root',
})
export class CorrespondenceSubjectService {
  private http = inject(HttpClient);

  corrSubjects = signal<CorrSubjectApi[]>([]);
  error = signal<any>(null);

  fetchCorrSubjects() {
    this.http.get<ApiResponse<CorrSubjectApi[]>>(`${environment.api}/document/subjects`)
    .subscribe({
        next: (resp) => this.corrSubjects.set(resp.data),
        error: (err) => this.error.set(err)
    })
  }
}
