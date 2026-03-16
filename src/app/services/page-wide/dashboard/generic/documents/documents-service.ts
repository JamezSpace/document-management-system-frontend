import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../../../environments/environment.development';
import {
  CreatedDocument,
  DocumentApi,
  InitDocumentApiPayload,
} from '../../../../../interfaces/documents/Document.api';
import { LifecycleActions } from '../../../../../interfaces/documents/Document.enum';
import { ApiResponse } from '../../../../../interfaces/shared/ApiResponse.interface';
import { ErrorType } from '../../../../../interfaces/shared/Error.interface';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  private http = inject(HttpClient);

  newDocument = signal<CreatedDocument | null>(null);
  documentFetchedById = signal<DocumentApi| null>(null);
  staffDocuments = signal<DocumentApi[]>([]);
  loading = signal<boolean>(false);
  error = signal<ErrorType | null>(null);

  initDocument(newDocumentPayload: InitDocumentApiPayload) {
    this.loading.set(true);

    this.http
      .post<ApiResponse<CreatedDocument>>(`${environment.api}/document`, {
        action: LifecycleActions.CREATE,
        ...newDocumentPayload,
      })
      .subscribe({
        next: (resp) => this.newDocument.set(resp.data),
        error: (err) => this.error.set(err),
        complete: () => this.loading.set(false),
      });
  }

  fetchDocsByStaff(staffId: string) {
    this.loading.set(true);

    this.http
      .get<ApiResponse<DocumentApi[]>>(`${environment.api}/document/documents/${staffId}`)
      .subscribe({
        next: (resp) => this.staffDocuments.set(resp.data),
        error: (err) => this.error.set(err),
        complete: () => this.loading.set(false),
      });
  }

  fetchDocById(docId: string) {
    this.loading.set(true);

    this.http
      .get<ApiResponse<DocumentApi>>(`${environment.api}/document/${docId}`)
      .subscribe({
        next: (resp) => this.documentFetchedById.set(resp.data),
        error: (err) => this.error.set(err),
        complete: () => this.loading.set(false),
      });
  }
}
