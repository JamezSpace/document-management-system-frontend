import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { finalize, Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { ApiResponse } from '../../../../models/api/ApiResponse.interface';
import { ErrorType } from '../../../../models/api/Error.interface';
import { SignaturePlaceHolderForBaseLevelAuthorityUi } from '../../../../models/api/workspace/signature/signature.ui';
import { WorkspaceContextApi } from '../../../../models/api/workspace/WorkspaceContext.api';
import { WorkspaceActions } from '../../../../enums/workspace/actions.enum';
import DocumentService from '../../../shared/services/DocumentService';
import { Router } from '@angular/router';
import { WorkspaceUiService } from '../ui/workspace-ui-service';

interface WorkspacePrimaryAction {
  label: string;
  action: string;
  icon?: string;
}

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  private router = inject(Router);
  private http = inject(HttpClient);
  documentService = inject(DocumentService);
  workspaceUiService = inject(WorkspaceUiService);

  loading = signal<boolean>(false);
  error = signal<ErrorType | null>(null);
  workspaceContext = signal<WorkspaceContextApi | null>(null);
  readonly workspaceContextDocument = computed(() => this.workspaceContext()?.metadata.document);
  readonly isAuthor = computed(() => this.workspaceContext()?.metadata.isAuthor ?? false);

  readonly permissions = computed(() => {
    const workspaceContext = this.workspaceContext();
    const workspaceActions = new Set(this.workspaceContext()?.authorizedActions ?? []);

    if (!workspaceContext)
      return {
        editable: false,
        readonly: true,
        canEdit: false,
        canSave: false,
        canAdvance: false,
        canDispatch: false,
        canReject: false,
        canAttach: false,
        canExport: false,
        canCc: false,
        canAcknowledge: false,
      };

    return {
      editable: workspaceContext.mode === 'edit',
      readonly: workspaceContext.mode === 'readonly',
      canEdit: workspaceActions.has(WorkspaceActions.EDIT),
      canSave: workspaceActions.has(WorkspaceActions.SAVE),
      canAdvance: workspaceActions.has(WorkspaceActions.ADVANCE),
      canDispatch: workspaceActions.has(WorkspaceActions.DISPATCH),
      canReject: workspaceActions.has(WorkspaceActions.REJECT),
      canAttach: workspaceActions.has(WorkspaceActions.ATTACH),
      canExport: workspaceActions.has(WorkspaceActions.EXPORT),
      canCc: workspaceActions.has(WorkspaceActions.CC),
      canAcknowledge: workspaceActions.has(WorkspaceActions.ACKNOWLEDGE),
    };
  });

  readonly viewModel = computed(() => ({
    document: this.workspaceContextDocument(),
    permissions: this.permissions(),
    primaryAction: this.primaryAction(),
    isChangesSaved: this.workspaceUiService.getIsDocumentSaved(),
  }));

  readonly primaryAction = computed<WorkspacePrimaryAction | null>(() => {
    const permissions = this.permissions();

    if (permissions.readonly) return null;
    if (!this.workspaceUiService.getIsDocumentSaved()()) {
      return {
        label: 'Save',
        action: 'save',
      };
    }

    if (permissions.canAdvance) {
      return {
        label: 'Advance for Approval',
        icon: 'lucideSend',
        action: 'advance',
      };
    }

    if (permissions.canDispatch) {
      return {
        label: 'Send Correspondence',
        icon: 'lucideSend',
        action: 'dispatch',
      };
    }

    if (permissions.canExport) {
      return {
        label: 'print correspondence',
        icon: 'lucidePrinter',
        action: 'export',
      };
    }

    return null;
  });

  exitWorkspace() {
    this.documentService.resetContext();

    return this.router.navigateByUrl('/office/documents');
  }

  // signaturePlaceholder !: WritableSignal<SignaturePlaceHolderForBaseLevelAuthorityUi>
  signaturePlaceholder = signal<SignaturePlaceHolderForBaseLevelAuthorityUi>({
    id: 'akhskash',
    format: '{signature}',
  });

  async fetchSignaturePlaceholder() {
    const data = this.http.get(
      `${environment.api}/signature/placeholder`,
    ) as Observable<SignaturePlaceHolderForBaseLevelAuthorityUi>;

    const signalData = toSignal(data);
    if (signalData()) this.signaturePlaceholder.set(signalData()!);
  }

  async fetchWorkspaceContext(documentId: string) {
    this.loading.set(true);

    this.http
      .get<ApiResponse<WorkspaceContextApi>>(`${environment.api}/workspace/${documentId}`)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => {
          this.workspaceContext.set(resp.data);
        },
        error: (err) => this.error.set(err),
      });
  }
}
