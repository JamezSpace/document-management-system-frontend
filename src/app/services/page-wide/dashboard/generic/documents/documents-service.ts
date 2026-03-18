import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../../../environments/environment.development';
import {
  DocumentApi,
  emptyDocument,
  InitDocumentApiPayload,
} from '../../../../../interfaces/documents/Document.api';
import { LifecycleActions } from '../../../../../interfaces/documents/Document.enum';
import { ApiResponse } from '../../../../../interfaces/shared/ApiResponse.interface';
import { ErrorType } from '../../../../../interfaces/shared/Error.interface';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  private http = inject(HttpClient);

  document = signal<DocumentApi | null>(null);
  staffDocuments = signal<DocumentApi[]>([]);
  loading = signal<boolean>(false);
  error = signal<ErrorType | null>(null);

  initDocument(newDocumentPayload: InitDocumentApiPayload) {
    this.loading.set(true);

    this.http
      .post<ApiResponse<DocumentApi>>(`${environment.api}/document`, {
        action: LifecycleActions.CREATE,
        ...newDocumentPayload,
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => this.document.set(resp.data),
        error: (err) => this.error.set(err),
      });
  }

  fetchDocsByStaff(staffId: string) {
    this.loading.set(true);

    this.http
      .get<ApiResponse<DocumentApi[]>>(`${environment.api}/document/documents/${staffId}`)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => this.staffDocuments.set(resp.data),
        error: (err) => this.error.set(err),
      });
  }

  fetchDocById(docId: string) {
    this.loading.set(true);

    this.http
      .get<ApiResponse<DocumentApi>>(`${environment.api}/document/${docId}`)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => this.document.set(resp.data),
        error: (err) => this.error.set(err),
      });
  }

  saveDocument(docId: string, payload: { document: DocumentApi; contentDelta: unknown }) {
    this.loading.set(true);

    this.http
      .post<ApiResponse<DocumentApi>>(`${environment.api}/document/${docId}/save`, {
        contentDelta: payload.contentDelta,
        document: payload.document
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => this.document.set(resp.data),
        error: (err) => this.error.set(err),
      });
  }
}
