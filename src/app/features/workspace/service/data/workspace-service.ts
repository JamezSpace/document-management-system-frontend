import { HttpContext } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
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
import { OrganizationService } from '../../../shared/services/organization/organization-service';
import { WorkspacePrimaryAction } from '../../../../models/ui/workspace/WorkspacePrimaryAction.ui';
import { WorkspaceApi } from '../../../../api/workspace/workspace.api';
import { OfficeContextService } from '../../../../office-platform/context/office-context.service';
import { UtilService } from '../../../../shared/utils/service/util-service';


@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  private router = inject(Router);
  private readonly officeContext = inject(OfficeContextService);
  private readonly workspaceApi = inject(WorkspaceApi);
  private readonly utilService = inject(UtilService);
  documentService = inject(DocumentService);
  workspaceUiService = inject(WorkspaceUiService);
  currentStaffService = inject(CurrentStaffService);
  organizationService = inject(OrganizationService);
  

  loading = signal<boolean>(false);
  readonly saving = this.documentService.saveDocumentLoading;
  error = signal<AppError | null>(null);
  workspaceContext = signal<WorkspaceContextApi | null>(null);
  readonly workspaceEtag = signal<string | null>(null);
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
    governance: this.workspaceContext()?.governance ?? null,
    canvas: this.workspaceContext()?.canvas ?? null,
    primaryAction: this.primaryAction(),
    isChangesSaved: this.workspaceUiService.getIsDocumentSaved(),
    pendingChanges: this.workspaceUiService.pendingChanges(),
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

    return null;
  });

  /** WORKSPACE FUNCTIONALITY */
  exitWorkspace() {
    this.documentService.resetContext();

    return this.router.navigateByUrl(this.officeContext.route('documents'));
  }

  /** CROSS-ENTITY OPERATIONS */
  saveDocument() {
    const context = this.workspaceContext();
    const actorId = this.currentStaffService.data()?.id;
    if (!context || !actorId) return;

    const document = context.metadata.document;
    const direction = document.correspondence.direction;
    const primaryAddressees = document.addressees.filter((addressee) => addressee.isPrimary);
    const primaryUnitId = primaryAddressees[0]?.recipientUnitId
      ?? document.correspondence.recipientUnitId
      ?? document.correspondence.originatingUnitId;
    const additionalAddressees = this.workspaceUiService.selectedAdditionalAddresseeIds().map(
      (id) => direction === 'external'
        ? { recipientUnitId: id, addressedToDesignationId: null, isPrimary: false }
        : { recipientUnitId: primaryUnitId, addressedToDesignationId: id, isPrimary: false },
    );
    const updatedDocument = {
      ...document,
      addressees: [...primaryAddressees, ...additionalAddressees],
    };
    const delta = this.workspaceUiService.getQuillEditorContent()().deltaContent;

    this.documentService.saveDocument(
      document.id,
      { document: updatedDocument, contentDelta: delta, actorId },
      (savedDocument) => {
        const savedAdditionalAddresseeIds = savedDocument.addressees
          .filter((addressee) => !addressee.isPrimary)
          .map((addressee) => savedDocument.correspondence.direction === 'external'
            ? addressee.recipientUnitId
            : addressee.addressedToDesignationId,
          )
          .filter((id): id is string => Boolean(id));

        this.workspaceContext.update((current) => current
          ? {
              ...current,
              metadata: { ...current.metadata, document: savedDocument },
            }
          : current,
        );
        this.workspaceUiService.commitSavedState(delta, savedAdditionalAddresseeIds);
        this.acceptMutationRevision(savedDocument.revision);
        this.fetchWorkspaceContext(savedDocument.id);
      },
      (error) => {
        if (error.apiError.code.codeName === 'stale_governance_decision') {
          this.fetchWorkspaceContext(document.id);
          this.utilService.showToast('info', 'The document changed. The workspace was refreshed; please retry.');
        }
      },
    );
  }

  /** DATA FETCHING */
  // signaturePlaceholder !: WritableSignal<SignaturePlaceHolderForBaseLevelAuthorityUi>
  signaturePlaceholder = signal<SignaturePlaceHolderForBaseLevelAuthorityUi>({
    id: 'akhskash',
    format: '{signature}',
  });

  async fetchSignaturePlaceholder() {
    // Placeholder configuration remains local until a backend resource exists.
    return this.signaturePlaceholder();
  }

  fetchWorkspaceContext(documentId: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.workspaceContext.set(null);
    this.workspaceEtag.set(null);

    this.workspaceApi
      .get(documentId, new HttpContext().set(ERROR_SURFACE, ErrorSurface.PAGE))
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          const context = response.body?.data;
          if (!context) return;

          const document = context.metadata.document;
          const additionalAddresseeIds = document.addressees
            .filter((addressee) => !addressee.isPrimary)
            .map((addressee) => document.correspondence.direction === 'external'
              ? addressee.recipientUnitId
              : addressee.addressedToDesignationId,
            )
            .filter((id): id is string => Boolean(id));

          this.workspaceEtag.set(
            response.headers.get('ETag') ?? `"${document.revision}"`,
          );
          this.workspaceContext.set(context);
          this.workspaceUiService.initializeAdditionalAddressees(additionalAddresseeIds);
          this.workspaceUiService.initializeQuillEditorContent({
            delta: document.currentVersion?.contentDelta ?? { ops: [] },
          });
        },
        error: (error: AppError) => this.error.set(error),
      });
  }

  currentRevisionHeader(): string | null {
    const document = this.workspaceContextDocument();
    if (!document) return null;

    return this.workspaceEtag() ?? `"${document.revision}"`;
  }

  acceptMutationRevision(documentRevision: number, etag?: string | null): void {
    this.workspaceEtag.set(etag ?? `"${documentRevision}"`);
    this.workspaceContext.update((current) => current
      ? {
          ...current,
          metadata: {
            ...current.metadata,
            document: { ...current.metadata.document, revision: documentRevision },
          },
        }
      : current,
    );
  }

  refreshWorkspace(): void {
    const documentId = this.workspaceContextDocument()?.id;
    if (documentId) this.fetchWorkspaceContext(documentId);
  }
}
