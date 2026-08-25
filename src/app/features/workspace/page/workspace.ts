import { Component, computed, effect, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFileLock, lucideSend } from '@ng-icons/lucide';
import { BrnAlertDialogContent } from '@spartan-ng/brain/alert-dialog';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { WorkspaceActions } from '../../../enums/workspace/actions.enum';
import { DocumentApi } from '../../../models/api/documents/Document.api';
import { LineLoader } from '../../../shared/components/loaders/line-loader/line-loader';
import { UtilService } from '../../../shared/utils/service/util-service';
import { AuthService } from '../../auth/service/auth-service';
import { DocumentService } from '../../documents/service/document/document-service';
import { DocumentTypesService } from '../../documents/service/document-types/document-types-service';
import { MinutesService } from '../../documents/service/minutes/minutes-service';
import { UnitMembersService } from '../../documents/service/unit-members/unit-members-service';
import { CurrentStaffService } from '../../shared/services/current-staff/current-staff-service';
import { OrganizationService } from '../../shared/services/organization/organization-service';
import { MemoBodyEditor } from '../components/editor/actual editors/memo-body-editor/memo-body-editor';
import { PaperControls } from '../components/editor/paper-controls/paper-controls';
import { PrintPreview } from '../components/editor/print-preview/print-preview';
import { MemoTemplate } from '../components/editor/templates/memo-template/memo-template';
import { CompositionContextPanel } from '../components/sidebar/composition-context-panel/composition-context-panel';
import { DocumentInspector } from '../components/sidebar/document-inspector/document-inspector';
import { Toolbar } from '../components/toolbar/toolbar';
import { WorkspaceService } from '../service/data/workspace-service';
import { MemoViewModel } from '../../../models/ui/workspace/MemoViewModel.ui';
import { PageError } from '../../../shared/components/errors/local/page-error/page-error';
import { OfficeContextService } from '../../../office-platform/context/office-context.service';
import { GovernanceService } from '../service/data/governance-service';

@Component({
  selector: 'nexus-workspace',
  imports: [
    NgIcon,
    LineLoader,
    BrnAlertDialogContent,
    HlmAlertDialogImports,
    Toolbar,
    CompositionContextPanel,
    DocumentInspector,
    PaperControls,
    PrintPreview,
    MemoTemplate,
    MemoBodyEditor,
    PageError,
  ],
  templateUrl: './workspace.html',
  styleUrl: './workspace.css',
  providers: [provideIcons({ lucideFileLock, lucideSend })],
})
export class Workspace implements OnInit, OnDestroy {
  @ViewChild(PaperControls) private paperControls?: PaperControls;

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly utilService = inject(UtilService);
  private readonly workspaceService = inject(WorkspaceService);
  private readonly documentService = inject(DocumentService);
  private readonly documentTypesService = inject(DocumentTypesService);
  private readonly unitMembersService = inject(UnitMembersService);
  private readonly minutesService = inject(MinutesService);
  private readonly currentStaffService = inject(CurrentStaffService);
  private readonly organizationService = inject(OrganizationService);
  private readonly officeContext = inject(OfficeContextService);
  private readonly governanceService = inject(GovernanceService);

  readonly workspaceLoading = this.workspaceService.loading;
  readonly workspaceError = this.workspaceService.error;
  readonly documentLoading = this.documentService.loading;
  readonly signedInStaff = this.currentStaffService.data;
  readonly workspaceContext = this.workspaceService.workspaceContext;
  readonly document = computed(() => this.workspaceContext()?.metadata.document ?? null);
  readonly workspaceActions = computed(() => new Set(this.workspaceContext()?.authorizedActions ?? []));
  readonly isReadOnly = computed(() => this.workspaceContext()?.mode === 'readonly');
  readonly isEditable = computed(() => this.workspaceContext()?.mode === 'edit');
  readonly isAuthor = computed(() => this.workspaceContext()?.metadata.isAuthor ?? false);
  readonly requiresServerRenderedPrint = computed(
    () => this.workspaceContext()?.governance.extraction.print.deliveryMode === 'server_rendered_only',
  );
  readonly workspaceMode = signal<'author' | 'reviewer'>('reviewer');
  readonly sidebarClosed = signal(false);
  readonly inspectorClosed = signal(false);
  readonly documentDirection = signal('');
  readonly documentType = this.documentTypesService.docType;
  readonly units = this.organizationService.units;
  readonly designations = this.organizationService.officesDesignations;

  readonly memoVm = computed<MemoViewModel | null>(() => {
    const document = this.document();
    const staff = this.signedInStaff();
    const documentType = this.documentType();

    if (!document || !staff || !documentType || documentType.code !== 'memo') return null;

    const primaryAddressee = document.addressees.find((addressee) => addressee.isPrimary);
    if (!primaryAddressee) return null;

    if (document.correspondence.direction !== 'external') {
      return {
        document,
        origin: { unit: staff.unit },
        recipient: null,
      };
    }

    const recipientUnit = this.units().find((unit) => unit.id === primaryAddressee.recipientUnitId);
    const recipientDesignation = this.designations().find(
      (designation) => designation.id === primaryAddressee.addressedToDesignationId,
    );

    if (!recipientUnit || !recipientDesignation) return null;

    return {
      document,
      origin: { unit: staff.unit },
      recipient: {
        unit: { id: recipientUnit.id, name: recipientUnit.fullName },
        designation: { id: recipientDesignation.id, title: recipientDesignation.title },
      },
    };
  });

  can(action: WorkspaceActions): boolean {
    return this.workspaceActions().has(action);
  }

  ngOnInit(): void {
    const staff = this.signedInStaff();
    if (!staff) {
      this.documentService.resetContext();
      this.authService.resetContext();
      void this.router.navigateByUrl('/auth');
      return;
    }

    if (this.document()) return;

    const documentId = this.activatedRoute.snapshot.paramMap.get('id');
    if (!documentId) {
      void this.router.navigateByUrl('/404');
      return;
    }

    this.workspaceService.fetchWorkspaceContext(documentId);
    this.minutesService.fetchMinutesForCorrespondence(documentId);
  }

  ngOnDestroy(): void {
    this.documentService.resetContext();
  }

  reloadWorkspace(): void {
    const documentId = this.activatedRoute.snapshot.paramMap.get('id');
    if (documentId) this.workspaceService.fetchWorkspaceContext(documentId);
  }

  goBack(): void {
    void this.router.navigateByUrl(this.officeContext.route('documents'));
  }

  previewDocument(): void {
    this.paperControls?.previewDocument();
  }

  printCorrespondence(): void {
    const directive = this.workspaceContext()?.governance.extraction.print;
    if (this.can(WorkspaceActions.EXPORT) && directive?.allowed) {
      this.governanceService.extract('print');
    }
  }

  exportCorrespondence(): void {
    const directive = this.workspaceContext()?.governance.extraction.export;
    if (this.can(WorkspaceActions.EXPORT) && directive?.allowed) {
      this.governanceService.extract('export');
    }
  }

  /** Establishes workspace-level UI state once the context and actor are available. */
  readonly workspaceBootEffect = effect(() => {
    const document = this.document();
    const staff = this.signedInStaff();
    if (!document || !staff) return;

    this.workspaceMode.set(document.ownerId === staff.id ? 'author' : 'reviewer');
    this.sidebarClosed.set(this.utilService.isMobile());
    this.documentDirection.set(document.correspondence.direction);
  });

  /** Keeps the document type lookup in sync with the opened document. */
  readonly documentTypeEffect = effect(() => {
    const documentTypeId = this.document()?.classification.documentTypeId;
    if (!documentTypeId || this.documentType()?.id === documentTypeId) return;

    this.documentTypesService.fetchDocTypeById(documentTypeId);
  });

  /** Loads only the lookup data required by the current correspondence. */
  readonly lookupEffect = effect(() => {
    const document = this.document();
    const staff = this.signedInStaff();
    if (!document || !staff) return;

    if (document.correspondence.direction === 'internal') {
      if (!this.unitMembersService.data().length) {
        this.unitMembersService.fetchUnitMembers(staff.unit.id);
      }
    } else if (!this.units().length && !this.organizationService.loading()) {
      this.organizationService.fetchUnits();
    }

    if (!this.designations().length && !this.organizationService.loading()) {
      this.organizationService.fetchAllDesignations();
    }
  });

  isExternalMemo(document: DocumentApi | null): boolean {
    return document?.correspondence.direction === 'external';
  }

  getAddresseeDesignation(document: DocumentApi): string {
    const staffId = document.correspondence.addressedToStaffId;
    if (!staffId) return '';

    return this.unitMembersService.data().find((member) => member.id === staffId)?.designation?.title ?? '';
  }

  submitDocument(): void {
    const document = this.document();
    if (!document) return;

    this.documentService.submitDocumentById(document.id, document.revision, (error) => {
      if (error.apiError.code.codeName === 'stale_governance_decision') {
        this.reloadWorkspace();
        this.utilService.showToast('info', 'The document changed. The workspace was refreshed; please retry.');
      }
    });
  }

  readonly documentSubmissionEffect = effect(() => {
    if (this.documentService.docSubmittedSuccess()) {
      void this.router.navigateByUrl(this.officeContext.route('documents'));
    }
  });
}
