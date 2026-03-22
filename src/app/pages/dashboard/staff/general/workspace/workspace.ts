import { Location } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideFile,
  lucideGripVertical,
  lucideLock,
  lucideLockOpen,
  lucidePanelLeftClose,
  lucidePanelRightClose,
  lucidePlus,
  lucideSave,
  lucideUserRound,
  lucideZoomIn,
  lucideZoomOut,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { MemoBodyEditor } from '../../../../../components/editors/memo-body-editor/memo-body-editor';
import { MemoTemplate } from '../../../../../components/editors/templates/memo-template/memo-template';
import { LineLoader } from '../../../../../components/system-wide/loaders/line-loader/line-loader';
import { SpartanMuted } from '../../../../../components/system-wide/typography/spartan-muted/spartan-muted';
import { SpartanP } from '../../../../../components/system-wide/typography/spartan-p/spartan-p';
import { GenericDashboardService } from '../../../../../services/page-wide/dashboard/generic/generic-dashboard-service';
import { WorkspaceService } from '../../../../../services/page-wide/dashboard/workspace/workspace-service';
import { UtilService } from '../../../../../services/system-wide/util-service/util-service';
import { OrgUnitCategory } from '../../../../../enum/identity/unitCategory.enum';
import { DocumentsService } from '../../../../../services/page-wide/dashboard/generic/documents/documents-service';
import { DocumentTypesService } from '../../../../../services/page-wide/dashboard/documents-registry/document-types/document-types-service';
import { ActivatedRoute, Router } from '@angular/router';
import { HlmKbdImports } from '@spartan-ng/helm/kbd';
import { UnitMembersService } from '../../../../../services/page-wide/dashboard/documents-registry/unit-members/unit-members-service';
import { OrgUnitsService } from '../../../../../services/page-wide/dashboard/documents-registry/org-units/org-units-service';
import { StaffDetailsService } from '../../../../../services/page-wide/dashboard/office-template/staff-details-service';

@Component({
  selector: 'nexus-workspace',
  imports: [
    NgIcon,
    SpartanMuted,
    SpartanP,
    LineLoader,
    MemoTemplate,
    MemoBodyEditor,
    MatAutocompleteModule,
    ReactiveFormsModule,
    HlmIcon,
    HlmSeparator,
    HlmButtonImports,
    HlmSelectImports,
    HlmDropdownMenuImports,
    HlmKbdImports
  ],
  templateUrl: './workspace.html',
  styleUrl: './workspace.css',
  providers: [
    provideIcons({
      lucideArrowLeft,
      lucideFile,
      lucideSave,
      lucideUserRound,
      lucidePlus,
      lucidePanelLeftClose,
      lucidePanelRightClose,
      lucideLock,
      lucideLockOpen,
      lucideZoomIn,
      lucideZoomOut,
      lucideGripVertical
    }),
  ],
})
export class Workspace implements OnInit {
  router = inject(Router);
  utilService = inject(UtilService);
  location = inject(Location);
  activatedRoute = inject(ActivatedRoute);
  workspaceLoading = signal<boolean>(false);
  workspaceService = inject(WorkspaceService);
  documentService = inject(DocumentsService);
  docTypesService = inject(DocumentTypesService);
  unitService = inject(OrgUnitsService);
  unitMembersService = inject(UnitMembersService);
  staffDetailsService = inject(StaffDetailsService);
  genericDashboardService = inject(GenericDashboardService);

  readonly signedInStaff = this.staffDetailsService.data;
  document = this.documentService.document;

  sidebarClosed = signal<boolean>(false);
  isDocmentMetadataEditable = signal<boolean>(false);

  goToPreviousLocation() {
    this.router.navigateByUrl('/office/documents')
  }

  ngOnInit(): void {
    // this.workspaceService.getSignaturePlaceholder();

    // disallow staff if it cant be ascertained if staff is logged in
    const staff = this.signedInStaff();
    if (!staff) {
      this.router.navigateByUrl('/auth');
      return;
    }

    // user refreshes a stale page
    const isThereAJustInitializedDocument = this.documentService.document();

    const doc = this.documentService.document();

    if (!doc) {
      const segments = this.activatedRoute.snapshot.url;
      const docId = segments[segments.length - 1].path;

      this.documentService.fetchDocById(docId);
    }
  }

  private workspaceInitEffect = effect(() => {
    // auto-close sidebar
    if (this.isMobile()) this.sidebarClosed.set(true);
    else this.sidebarClosed.set(false);

    // fetch document
    const documentFetchedById = this.documentService.document();

    if (!documentFetchedById) return;

    // fetch document type
    const typeId = this.documentService.document()!.classification.documentTypeId;

    if (!this.docTypesService.docType()) this.docTypesService.fetchDocTypeById(typeId);
  });

  private effectRunsOnlyNecessarySecondaryItems = effect(() => {
      const doc = this.document();
    const staff = this.signedInStaff();

  if (!doc || !staff) return;

  const staffUnit = staff.unit;

    if (this.document()?.correspondence.direction === 'internal') {
      // ensure unit members are fetched if it doesnt pre-exist
      if (!this.unitMembersService.data()) this.unitMembersService.fetchUnitMembers(staffUnit.id);
    } else {
      // ensure units are fetched if they dont pre-exist
      if (!this.unitService.data()) this.unitService.fetchOrgUnits();
    }
  });

  isMobile = this.utilService.isMobile;
  documentType = this.docTypesService.docType;

  memoDocument = computed(() => {
    const doc = this.document();
    const type = this.documentType();

    return type?.code === 'memo' && doc ? doc : null;
  });

  units = this.unitService.data;
  unitMembers = this.unitMembersService.data;
  academicUnits = computed(() =>
    this.units().filter((unit) => unit.sector === OrgUnitCategory.ACADEMIC),
  );
  nonacademicUnits = computed(() =>
    this.units().filter((unit) => unit.sector === OrgUnitCategory.NON_ACADEMIC),
  );

  showStaffLabelRatherThanId = (staffId: string) => {
    if (!staffId) return '';

    const member = this.unitMembers().find((m) => m.id === staffId);
    return member?.fullName ?? '';
  };

  showUnitLabelRatherThanId = (unitId: string) => {
    if (!unitId) return '';

    const unit = this.units().find(unit => unit.id === unitId);
    return unit?.code ?? '';
  };

  fileUploaded = signal<File | null>(null);
  onUploadAttachment(event: any) {
    this.workspaceLoading.set(true);
    const uploadedFile = event.target.files[0];

    // perform check and scan on this document

    // update component with file uploaded
    this.fileUploaded.set(uploadedFile);
    this.workspaceLoading.set(false);
  }

  documentMetadata = new FormGroup({
    department: new FormControl(''),
    volume: new FormControl(''),
    addressee: new FormControl(''),
  });

  searchUnitValue = signal<string>('');
  searchUnitMemberValue = signal<string>('');
  searchVolValue = signal<string>('');

  filteredUnits = computed(() => {
    const filterValue = this.searchUnitValue().toLowerCase();

    return this.units().filter((unit) => unit.fullName.toLowerCase().includes(filterValue));
  });

  filteredUnitsMembers = computed(() => {
    const filterValue = this.searchUnitMemberValue().toLowerCase();

    return this.unitMembers().filter((unitMember) =>
      unitMember.fullName.toLowerCase().includes(filterValue),
    );
  });

  //   filteredVolumes = computed(() => {
  //     const filterValue = this.searchVolValue().toLowerCase();

  //     return this.correspondenceVolumes().filter((vol) =>
  //       vol.name.toLowerCase().includes(filterValue),
  //     );
  //   });

  updateDeptSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchUnitValue.set(value);
  }
  updateVolSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchVolValue.set(value);
  }

  // scans for signature placeholder
  signaturePlaceholderBounds = computed(() => this.scanForSignaturePlaceholderAndReturnBounds());

  isPrintPreview = signal(false);
  editorHtmlContent = signal<string>('');

  previewDocument() {
    // store previous zoom level
    this.previousZoomLevel.set(this.zoomLevel());

    //reset zoom level
    this.resetZoom();

    // retrieve content as html
    const htmlContent = this.retrieveEditorContentsAsSpecificType('html') as string;

    console.log(htmlContent);
    

    this.editorHtmlContent.set(htmlContent);

    // checks if signature exists
    const signatureExists = this.signaturePlaceholderBounds().exists;

    this.isPrintPreview.set(true);
  }

  exitPreview() {
    // set current zoom level to the previous value
    this.zoomLevel.set(this.previousZoomLevel());

    this.paperViewControls.set(false);

    this.isPrintPreview.set(false);
  }

  paperViewControls = signal<boolean>(false);
  @ViewChild('workspaceRoot')
  workspaceRoot!: ElementRef<HTMLDivElement>;

  onMouseEnter() {
    if (this.isPrintPreview()) {
      this.paperViewControls.set(true);
    }
  }

  onMouseLeave() {
    if (this.isPrintPreview()) {
      this.paperViewControls.set(false);
    }
  }

  retrieveEditorContentsAsSpecificType(desiredType: 'delta' | 'text' | 'html') {
    const quillEditorContent = this.documentService.quillEditorContent();

    if (desiredType === 'delta') return quillEditorContent.deltaContent;
    else if (desiredType === 'html') return quillEditorContent.htmlContent;
    else if (desiredType === 'text') return quillEditorContent.textContent;

    return '';
  }

  signaturePlaceholder = this.workspaceService.signaturePlaceholder;
  scanForSignaturePlaceholderAndReturnBounds(): SignatureBounds {
    const editorContentText = this.documentService.quillEditorContent().textContent;

    const signaturePlaceholderFormat = this.signaturePlaceholder().format;

    const beginIndexOfPlaceholder = editorContentText.indexOf(signaturePlaceholderFormat);

    if (beginIndexOfPlaceholder < 0) return { exists: false };

    return {
      exists: true,
      details: {
        begin: beginIndexOfPlaceholder,
        end: beginIndexOfPlaceholder + signaturePlaceholderFormat.length - 1,
      },
    };
  }

  // 1.0 is 100%, 0.5 is 50%, etc.
  zoomLevel = signal<number>(1.0);
  previousZoomLevel = signal<number>(1);

  // Compute the transform string for the template
  canvasTransform = computed(() => `scale(${this.zoomLevel()})`);

  zoomIn() {
    this.zoomLevel.update((z) => Math.min(z + 0.1, 2.0)); // Cap at 200%
  }

  zoomOut() {
    this.zoomLevel.update((z) => Math.max(z - 0.1, 0.5)); // Floor at 50%
  }

  resetZoom() {
    this.zoomLevel.set(1.0);
  }

  saveDocument() {
    const openedDocument = this.document()!;
    const contentAsDelta = this.retrieveEditorContentsAsSpecificType('delta');

    this.documentService.saveDocument(openedDocument.id, {
      document: openedDocument,
      contentDelta: contentAsDelta,
    });
  }
}

interface SignatureBounds {
  exists: boolean;
  details?: {
    begin: number;
    end: number;
  };
}
