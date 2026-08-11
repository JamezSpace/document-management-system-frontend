import { HttpClient, HttpContext } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { finalize, Observable } from 'rxjs';
import { ApiResponse } from '../../../../models/api/ApiResponse.api';
import { SignaturePlaceHolderForBaseLevelAuthorityUi } from '../../../../models/api/workspace/signature/signature.ui';
import { WorkspaceContextApi } from '../../../../models/api/workspace/WorkspaceContext.api';
import { ERROR_SURFACE } from '../../../../core/interceptors/error/error-context';
import { ErrorSurface } from '../../../../enums/global/errorSurface.enum';
import type { AppError } from '../../../../models/ui/global/ErrorPresentation.ui';
import { WorkspaceActions } from '../../../../enums/workspace/actions.enum';
import { Router } from '@angular/router';
import { WorkspaceUiService } from '../ui/workspace-ui-service';
import DocumentService from '../../../shared/services/document/DocumentService';
import { CurrentStaffService } from '../../../shared/services/current-staff/current-staff-service';
import { environment } from '../../../../../environments/environment.development';
import { OrganizationService } from '../../../shared/services/organization/organization-service';
import { WorkspacePrimaryAction } from '../../../../models/ui/workspace/WorkspacePrimaryAction.ui';


@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  private router = inject(Router);
  private http = inject(HttpClient);
  documentService = inject(DocumentService);
  workspaceUiService = inject(WorkspaceUiService);
  currentStaffService = inject(CurrentStaffService);
  organizationService = inject(OrganizationService);
  

  loading = signal<boolean>(false);
  error = signal<AppError | null>(null);
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

  /** WORKSPACE FUNCTIONALITY */
  exitWorkspace() {
    this.documentService.resetContext();

    return this.router.navigateByUrl('/office/documents');
  }

  /** CROSS-ENTITY OPERATIONS */
  saveDocument() {
     const context = this.workspaceContext();
     const actor = this.currentStaffService.data()

      if (!context || !actor) return;

      const delta =
          this.workspaceUiService
              .getQuillEditorContent()()
              .deltaContent;

      this.documentService.saveDocument(
          context.metadata.document.id,
          {
              document: context.metadata.document,
              actorId: actor.id,
              contentDelta: delta
          }
      );
  }

  /** DATA FETCHING */
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

  fetchWorkspaceContext(documentId: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.http
      .get<ApiResponse<WorkspaceContextApi>>(
        `${environment.api}/workspace/${documentId}`,
        {
          context: new HttpContext().set(ERROR_SURFACE, ErrorSurface.PAGE)
        },
      )
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => this.workspaceContext.set(response.data),
        error: (error: AppError) => this.error.set(error),
      });
  }
}
