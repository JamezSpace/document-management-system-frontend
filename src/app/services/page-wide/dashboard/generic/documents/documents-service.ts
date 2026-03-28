import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Delta, Op } from 'quill';
import { finalize } from 'rxjs';
import { environment } from '../../../../../../environments/environment.development';
import {
  DocumentApi,
  InitDocumentApiPayload,
} from '../../../../../interfaces/documents/Document.api';
import { LifecycleActions } from '../../../../../interfaces/documents/Document.enum';
import { ApiResponse } from '../../../../../interfaces/shared/ApiResponse.interface';
import { ErrorType } from '../../../../../interfaces/shared/Error.interface';
import { UtilService } from '../../../../system-wide/util-service/util-service';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  private http = inject(HttpClient);
  private utilService = inject(UtilService);

  document = signal<DocumentApi | null>(null);
  staffDocuments = signal<DocumentApi[]>([]);
  loading = signal<boolean>(false);
  error = signal<ErrorType | null>(null);
  isDocumentSaved = signal<boolean>(false);

  quillEditorContent = signal<{
    deltaContent: Delta | null;
    textContent: string;
    htmlContent: string;
  }>({
    deltaContent: null,
    textContent: '',
    htmlContent: '',
  });

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
        next: (resp) => {
          this.document.set(resp.data);

          const editorDelta = resp.data.currentVersion?.contentDelta;

          if (editorDelta)
            this.quillEditorContent.set({
              deltaContent: new Delta(editorDelta as { ops: Op[] }),
              htmlContent: '',
              textContent: '',
            });
        },
        error: (err) => this.error.set(err),
      });
  }

  saveDocument(
    docId: string,
    payload: { document: DocumentApi; contentDelta: unknown; actorId: string },
  ) {
    this.loading.set(true);

    this.http
      .post<ApiResponse<DocumentApi>>(`${environment.api}/document/${docId}/save`, {
        contentDelta: payload.contentDelta,
        document: payload.document,
        actorId: payload.actorId,
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => {
          // set data
          this.document.set(resp.data);

          // toggle signal
          this.isDocumentSaved.set(true);
        },
        error: (err) => this.error.set(err),
      });
  }

  docSubmittedSuccess = signal<boolean>(false);
  submitDocument(staffId: string, doc: DocumentApi) {
    this.loading.set(true);

    this.http
      .post<ApiResponse<DocumentApi>>(`${environment.api}/document/${staffId}/submit`, {
        ...doc,
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => {
          this.document.set(resp.data);

          this.utilService.showToast('info', 'Correspondence submitted to registry successfully!');

          this.docSubmittedSuccess.set(true);
        },
        error: (err) => this.error.set(err),
      });
  }

  deleteDocument(id: string) {
    this.loading.set(true);

    this.http
      .delete<ApiResponse<void>>(`${environment.api}/document/${id}`)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => {
          this.staffDocuments.update((docs) => docs.filter((doc) => doc.id !== id));

          console.log('document deleted!');
        },
        error: (err) => this.error.set(err),
      });
  }

  resetContext() {
    this.document.set(null);
    this.isDocumentSaved.set(false);
    this.docSubmittedSuccess.set(false);
    this.error.set(null);

    this.quillEditorContent.set({ deltaContent: null, textContent: '', htmlContent: '' });
  }
}
