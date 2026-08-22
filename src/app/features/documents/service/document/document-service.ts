import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { finalize, Subscription } from 'rxjs';
import { DocumentApi, InitDocumentApiPayload } from '../../../../models/api/documents/Document.api';
import type { AppError } from '../../../../models/ui/global/ErrorPresentation.ui';
import { UtilService } from '../../../../shared/utils/service/util-service';
import { environment } from '../../../../../environments/environment.development';
import { ApiResponse } from '../../../../models/api/ApiResponse.api';
import { LifecycleActions } from '../../../../enums/document/document.enum';
import { WorkspaceUiService } from '../../../workspace/service/ui/workspace-ui-service';
import { DocumentsApi } from '../../../../api/documents/documents.api';
import type {
  CursorPageInfoDto,
  DocumentSearchItemDto,
} from '../../../../api/documents/documents.contracts';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private http = inject(HttpClient);
  private utilService = inject(UtilService);
  private workspaceUiService = inject(WorkspaceUiService);
  private readonly documentsApi = inject(DocumentsApi);

  loading = signal<boolean>(false);
  error = signal<AppError | null>(null);
  document = signal<DocumentApi | null>(null);
  staffDocuments = signal<DocumentApi[]>([]);
  readonly searchResults = signal<DocumentSearchItemDto[]>([]);
  readonly searchPageInfo = signal<CursorPageInfoDto | null>(null);
  readonly searchLoading = signal(false);
  private searchSubscription?: Subscription;

  private manualPrintPreview = signal(false);
  readonly autoPrintPreview = signal(false);

  get getManualPrintPreview(): WritableSignal<boolean> {
    return this.manualPrintPreview;
  }

  set setManualPrintPreview(value: boolean) {
    this.manualPrintPreview.set(value);
  }

  setAutoPrintPreview(value: boolean) {
    this.autoPrintPreview.set(value);
  }

  resetContext() {
    this.document.set(null);
    this.docSubmittedSuccess.set(false);
    this.error.set(null);
    this.manualPrintPreview.set(false);
    this.autoPrintPreview.set(false);

    this.workspaceUiService.resetWorkspaceState();
  }

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
        error: (err: AppError) => this.error.set(err),
      });
  }

  fetchDocumentsByStaff(staffId: string, context?: HttpContext) {
    this.loading.set(true);

    this.http
      .get<ApiResponse<DocumentApi[]>>(
        `${environment.api}/document/documents/${staffId}`,
        context ? { context } : undefined,
      )
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => this.staffDocuments.set(resp.data),
        error: (err) => this.error.set(err),
      });
  }

  fetchDocumentById(docId: string) {
    this.loading.set(true);

    this.http
      .get<ApiResponse<DocumentApi>>(`${environment.api}/document/${docId}`)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => {
          this.document.set(resp.data);

          const editorDelta = resp.data.currentVersion?.contentDelta;

          if (editorDelta)
            this.workspaceUiService.initializeQuillEditorContent({
                delta: editorDelta,
            })
        },
        error: (err) => this.error.set(err),
      });
  }

  
  saveDocumentLoading = signal<boolean>(false);
  saveDocument(
    docId: string,
    payload: { document: DocumentApi; contentDelta: unknown; actorId: string },
    onSaved?: (document: DocumentApi) => void,
    onError?: (error: AppError) => void,
  ) {
    this.saveDocumentLoading.set(true);

    this.http
      .post<ApiResponse<DocumentApi>>(
        `${environment.api}/document/${docId}/save`,
        {
          contentDelta: payload.contentDelta,
          document: payload.document,
          actorId: payload.actorId,
        },
        { headers: { 'If-Match': `"${payload.document.revision}"` } },
      )
      .pipe(finalize(() => this.saveDocumentLoading.set(false)))
      .subscribe({
        next: (resp) => {
          // set data
          this.document.set(resp.data);
          onSaved?.(resp.data);
        },
        error: (err: AppError) => {
          this.error.set(err);
          onError?.(err);
        },
      });
  }

  saveDocumentContent(docId: string, revision: number, contentDelta: unknown) {
    this.saveDocumentLoading.set(true);

    this.documentsApi
      .saveContent(docId, revision, { contentDelta })
      .pipe(finalize(() => this.saveDocumentLoading.set(false)))
      .subscribe({
        next: (resp) => {
          this.document.set(resp.data);
          this.workspaceUiService.commitChanges();
        },
        error: (err: AppError) => this.error.set(err),
      });
  }

  searchDocuments(query: string, cursor?: string, append = false): void {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      this.clearDocumentSearch();
      return;
    }

    this.searchSubscription?.unsubscribe();
    this.searchLoading.set(true);
    this.searchSubscription = this.documentsApi
      .search(normalizedQuery, 25, cursor)
      .pipe(finalize(() => this.searchLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.searchResults.update((current) =>
            append ? [...current, ...response.data.items] : response.data.items,
          );
          this.searchPageInfo.set(response.data.pageInfo);
        },
      });
  }

  clearDocumentSearch(): void {
    this.searchSubscription?.unsubscribe();
    this.searchLoading.set(false);
    this.searchResults.set([]);
    this.searchPageInfo.set(null);
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

  submitDocumentById(
    documentId: string,
    revision: number,
    onError?: (error: AppError) => void,
  ) {
    this.loading.set(true);

    this.documentsApi
      .submit(documentId, revision)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => {
          if (!resp.body) return;
          this.document.set(resp.body.data);
          this.utilService.showToast('info', 'Correspondence submitted to registry successfully!');
          this.docSubmittedSuccess.set(true);
        },
        error: (err: AppError) => {
          this.error.set(err);
          onError?.(err);
        },
      });
  }

  deleteDocument(id: string, revision: number) {
    this.loading.set(true);

    this.http
      .delete<ApiResponse<void>>(`${environment.api}/document/${id}`, {
        headers: { 'If-Match': `"${revision}"` },
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => {
          this.staffDocuments.update((docs) => docs.filter((doc) => doc.id !== id));

          console.log('document deleted!');
        },
        error: (err) => this.error.set(err),
      });
  }

}
