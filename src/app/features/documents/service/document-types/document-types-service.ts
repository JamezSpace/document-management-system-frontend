import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { ApiResponse } from '../../../../models/api/ApiResponse.api';
import { DocTypeApi } from '../../../../models/api/documents/docType/docType.api';
import type { AppError } from '../../../../models/ui/global/ErrorPresentation.ui';


@Injectable({
  providedIn: 'root',
})
export class DocumentTypesService {
  private http = inject(HttpClient);

  allDocTypes = signal<DocTypeApi[]>([]);
  docType = signal<DocTypeApi | null>(null);
  error = signal<AppError | null>(null);

  fetchDocTypes() {
    this.http.get<ApiResponse<DocTypeApi[]>>(`${environment.api}/document/types`)
    .subscribe({
        next: (resp) => this.allDocTypes.set(resp.data),
        error: (err) => this.error.set(err)
    })
  }

  fetchDocTypeById(typeId: string) {
    this.http.get<ApiResponse<DocTypeApi>>(`${environment.api}/document/type/${typeId}`)
    .subscribe({
        next: (resp) => this.docType.set(resp.data),
        error: (err) => this.error.set(err)
    })
  }
}
