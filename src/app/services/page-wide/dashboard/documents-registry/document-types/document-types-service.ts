import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { DocTypeApi } from '../../../../../interfaces/documents/docType/docType.api';
import { ApiResponse } from '../../../../../interfaces/shared/ApiResponse.interface';
import { environment } from '../../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class DocumentTypesService {
  private http = inject(HttpClient);

  allDocTypes = signal<DocTypeApi[]>([]);
  docType = signal<DocTypeApi | null>(null);
  error = signal<any>(null);

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
