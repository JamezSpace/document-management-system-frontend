import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { DocumentApi, InitDocumentApiPayload } from '../../../../models/api/documents/Document.api';
import { ErrorType } from '../../../../models/api/Error.interface';
import { UtilService } from '../../../../shared/utils/service/util-service';
import { environment } from '../../../../../environments/environment.development';
import { ApiResponse } from '../../../../models/api/ApiResponse.interface';
import { LifecycleActions } from '../../../../enums/document/document.enum';
import { finalize } from 'rxjs';
import { WorkspaceUiService } from '../../../workspace/service/ui/workspace-ui-service';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private http = inject(HttpClient);
  private utilService = inject(UtilService);
  private workspaceUiService = inject(WorkspaceUiService);

  loading = signal<boolean>(false);
  error = signal<ErrorType | null>(null);
  document = signal<DocumentApi | null>(null);
  staffDocuments = signal<DocumentApi[]>([]);

  resetContext() {
    this.document.set(null);
    this.workspaceUiService.setIsDocumentSaved(true);
    this.docSubmittedSuccess.set(false);
    this.error.set(null);

    this.workspaceUiService.resetQuillEditorContent();
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
        error: (err) => this.error.set(err),
      });
  }

  fetchDocumentsByStaff(staffId: string) {
    this.loading.set(true);

    this.http
      .get<ApiResponse<DocumentApi[]>>(`${environment.api}/document/documents/${staffId}`)
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
            this.workspaceUiService.setQuillEditorContent({
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
  ) {
    this.saveDocumentLoading.set(true);

    this.http
      .post<ApiResponse<DocumentApi>>(`${environment.api}/document/${docId}/save`, {
        contentDelta: payload.contentDelta,
        document: payload.document,
        actorId: payload.actorId,
      })
      .pipe(finalize(() => this.saveDocumentLoading.set(false)))
      .subscribe({
        next: (resp) => {
          // set data
          this.document.set(resp.data);

          // toggle signal
          this.workspaceUiService.setIsDocumentSaved(true);
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


  // resolve this later
//   readonly autoPrintPreview = computed(() => this.isReadOnly());
//   private manualPrintPreview = signal<boolean>(false);
//   public get getManualPrintPreview(): WritableSignal<boolean> {
//     return this.manualPrintPreview;
//   }

//   public set setManualPrintPreview(value: boolean) {
//     if (this.workspaceMode() === 'author' || !this.isDocumentActive())
//       this.manualPrintPreview.set(value);
//   }


//   isValidToShowPrintPreviewMenuOptions = computed(() => {
//     // reviewers MUST NOT trigger menu button to escape print preview
//     if (this.workspaceMode() === 'reviewer') return false;

//     // author can only escape print preview so long the document is not in active lifecycle state
//     if (!this.isDocumentActive()) return true;

//     return false;
//   });
}
