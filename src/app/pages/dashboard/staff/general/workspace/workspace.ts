import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { hugeCancelCircle } from '@ng-icons/huge-icons';
import {
  lucideArrowLeft,
  lucideFile,
  lucideFileLock,
  lucideGripVertical,
  lucideHistory,
  lucideLock,
  lucideLockOpen,
  lucidePanelLeftClose,
  lucidePanelRightClose,
  lucidePlus,
  lucidePrinter,
  lucideSave,
  lucideSend,
  lucideUserRound,
  lucideZoomIn,
  lucideZoomOut,
} from '@ng-icons/lucide';
import { BrnAlertDialogContent, BrnAlertDialogTrigger } from '@spartan-ng/brain/alert-dialog';
import { HlmAccordionImports } from '@spartan-ng/helm/accordion';
import { HlmAlertDialog, HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmKbdImports } from '@spartan-ng/helm/kbd';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { MemoBodyEditor } from '../../../../../components/editors/memo-body-editor/memo-body-editor';
import { MemoTemplate } from '../../../../../components/editors/templates/memo-template/memo-template';
import { LineLoader } from '../../../../../components/system-wide/loaders/line-loader/line-loader';
import { SpartanMuted } from '../../../../../components/system-wide/typography/spartan-muted/spartan-muted';
import { MinuteAction } from '../../../../../enum/document/minute.enum';
import { OrgUnitCategory } from '../../../../../enum/identity/unitCategory.enum';
import { DocumentApi } from '../../../../../interfaces/api/documents/Document.api';
import { emptyDesignation } from '../../../../../interfaces/api/org units/designation.api';
import { AuthService } from '../../../../../services/page-wide/auth/auth-service';
import { DocumentTypesService } from '../../../../../services/page-wide/dashboard/documents-registry/document-types/document-types-service';
import { MinutesService } from '../../../../../services/page-wide/dashboard/documents-registry/minutes/minutes-service';
import { OrgUnitsService } from '../../../../../services/page-wide/dashboard/documents-registry/org-units/org-units-service';
import { UnitMembersService } from '../../../../../services/page-wide/dashboard/documents-registry/unit-members/unit-members-service';
import { DocumentsService } from '../../../../../services/page-wide/dashboard/generic/documents/documents-service';
import { GenericDashboardService } from '../../../../../services/page-wide/dashboard/generic/generic-dashboard-service';
import { StaffDetailsService } from '../../../../../services/page-wide/dashboard/office-template/staff-details-service';
import { StaffService } from '../../../../../services/page-wide/dashboard/operations/hr/staff/staff-service';
import { WorkspaceService } from '../../../../../services/page-wide/dashboard/workspace/workspace-service';
import { UtilService } from '../../../../../services/system-wide/util-service/util-service';
import { emptyUnit } from '../../../../../interfaces/api/org units/units.api';

@Component({
  selector: 'nexus-workspace',
  imports: [
    NgIcon,
    SpartanMuted,
    LineLoader,
    MemoTemplate,
    MemoBodyEditor,
    MatAutocompleteModule,
    MatChipsModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    HlmIcon,
    HlmSeparator,
    BrnAlertDialogContent,
    BrnAlertDialogTrigger,
    HlmAlertDialogImports,
    HlmButtonImports,
    HlmSelectImports,
    HlmDropdownMenuImports,
    HlmCheckboxImports,
    HlmKbdImports,
    HlmTextareaImports,
    HlmSpinnerImports,
    HlmAccordionImports,
  ],
  templateUrl: './workspace.html',
  styleUrl: './workspace.css',
  providers: [
    provideIcons({
      lucideArrowLeft,
      lucideFile,
      lucideSave,
      lucideSend,
      lucideUserRound,
      lucidePlus,
      lucidePrinter,
      lucidePanelLeftClose,
      lucidePanelRightClose,
      lucideFileLock,
      lucideLock,
      lucideLockOpen,
      lucideZoomIn,
      lucideZoomOut,
      lucideGripVertical,
      lucideHistory,
      hugeCancelCircle,
    }),
  ],
})
export class Workspace implements OnInit, OnDestroy {
  router = inject(Router);
  authService = inject(AuthService);
  utilService = inject(UtilService);
  activatedRoute = inject(ActivatedRoute);
  workspaceService = inject(WorkspaceService);
  documentService = inject(DocumentsService);
  docTypesService = inject(DocumentTypesService);
  unitService = inject(OrgUnitsService);
  staffService = inject(StaffService);
  minutesService = inject(MinutesService);
  unitMembersService = inject(UnitMembersService);
  staffDetailsService = inject(StaffDetailsService);
  genericDashboardService = inject(GenericDashboardService);
  workspaceLoading = signal<boolean>(false);
  documentLoading = this.documentService.loading;
  sidebarClosed = signal<boolean>(false);
  isDocmentMetadataEditable = signal<boolean>(false);

  readonly signedInStaff = this.staffDetailsService.data;
  document = this.documentService.document;

  minuteServiceInOperation = this.minutesService.loading;
  minutes = this.minutesService.minutes;

  workspaceMode = this.documentService.workspaceMode;

  isReadOnly = this.documentService.isReadOnly;
  isDocumentActive = this.documentService.isDocumentActive;
  manualPrintPreview = this.documentService.getManualPrintPreview;
  isValidToShowPrintPreviewMenuOptions = computed(() => {
    const a = this.documentService.isValidToShowPrintPreviewMenuOptions();
    const b = this.paperViewControls();

    console.log('service computation: ', a);
    console.log('eligible print preview: ', this.isEligibleForPrintPreview());
    console.log('hover: ', b);

    return a && b;
  });

  readonly isEligibleForPrintPreview = computed(
    () => this.documentService.autoPrintPreview() || this.manualPrintPreview(),
  );

  goToDocOverviewPage() {
    this.documentService.resetContext();

    return this.router.navigateByUrl('/office/documents');
  }

  async ngOnInit(): Promise<void> {
    // this.workspaceService.getSignaturePlaceholder();

    // disallow staff if it cant be ascertained if staff is logged in
    const staff = this.signedInStaff();
    if (!staff) {
      this.documentService.resetContext();

      this.authService.resetContext();
      this.router.navigateByUrl('/auth');
      return;
    }

    // user refreshes a stale page
    const doc = this.documentService.document();

    if (!doc) {
      const docId = this.activatedRoute.snapshot.paramMap.get('id');

      if (!docId) {
        this.router.navigateByUrl('404');
        return;
      }

      // fetch necessary data
      this.documentService.fetchDocById(docId);
      this.unitMembersService.fetchUnitMembers(staff.unit.id);
      this.staffService.fetchAllDesignations();
      this.minutesService.fetchMinutesForCorrespondence(docId);
    }
  }

  ngOnDestroy() {
    this.documentService.resetContext();
  }

  WorkspaceInitEffect = effect(() => {
    const doc = this.document();
    const staff = this.signedInStaff();

    if (!doc || !staff) return;
    this.workspaceMode.set(doc.ownerId === staff.id ? 'author' : 'reviewer');
    // keep the attachments pane visible whenever the workspace is locked for editing
    this.sidebarClosed.set(this.isMobile());

    // fetch document type
    const typeId = doc.classification.documentTypeId;
    if (this.docTypesService.docType()?.id !== typeId) {
      this.docTypesService.fetchDocTypeById(typeId);
    }

    const staffUnit = staff.unit;

    if (doc.correspondence.direction === 'internal') {
      // ensure unit members are fetched if it doesnt pre-exist
      if (!this.unitMembersService.data().length) {
        this.unitMembersService.fetchUnitMembers(staffUnit.id);
      }
    } else {
      // ensure units are fetched if they dont pre-exist
      if (!this.unitService.units().length) {
        this.unitService.fetchOrgUnits();
      }
    }

    this.documentDirection.set(doc.correspondence.direction);
  });

  isMobile = this.utilService.isMobile;
  documentType = this.docTypesService.docType;
  documentDirection = signal<string>('');

  memoDocument = computed(() => {
    const doc = this.document();
    const type = this.documentType();
    const staff = this.signedInStaff();

    if (!staff || !doc || !type) return;
    const originUnit = staff.unit;
    const primaryAddressee = doc.addressees.find((addr) => addr.isPrimary)!;

    const recipientUnit = this.units().find((unit) => unit.id === primaryAddressee.recipientUnitId);
    const recipientDesignation = this.designations().find(
      (desig) => desig.id === primaryAddressee.addressedToDesignationId,
    );

    if (!recipientUnit || !recipientDesignation) return;

    return type.code === 'memo'
      ? {
          document: doc,
          origin: {
            unit: originUnit,
          },
          recipient: {
            unit: {
              id: primaryAddressee.recipientUnitId,
              name: recipientUnit.fullName,
            },
            designation: {
              id: primaryAddressee.addressedToDesignationId,
              title: recipientDesignation.title,
            },
          },
        }
      : null;
  });

  isExternalMemo(doc: DocumentApi | null) {
    return doc && doc.correspondence.direction === 'external' ? true : false;
  }

  attachedDocuments = computed(() => {
    const doc = this.document();

    if (!doc || !this.isDocumentActive()) return [];

    const mediaId = doc.currentVersion?.mediaId?.trim();
    if (!mediaId) return [];

    return [
      {
        id: mediaId,
        title: doc.title || 'Attached document',
        description: `Version ${doc.currentVersion?.versionNumber ?? 1} attachment`,
        mediaId,
      },
    ];
  });

  getAddresseeDesignation(doc: DocumentApi) {
    const staffId = doc.correspondence.addressedToStaffId;

    if (!staffId) return;

    const foundStaff = this.unitMembers().find((member) => member.id === staffId);

    if (!foundStaff) return;

    return foundStaff.designation?.title;
  }

  units = this.unitService.units;
  unitMembers = this.unitMembersService.data;
  academicUnits = computed(() =>
    this.units().filter((unit) => unit.sector === OrgUnitCategory.ACADEMIC),
  );
  nonacademicUnits = computed(() =>
    this.units().filter((unit) => unit.sector === OrgUnitCategory.NON_ACADEMIC),
  );

  showUnitLabelRatherThanId = (unitId: string) => {
    if (!unitId) return '';

    const unit = this.units().find((unit) => unit.id === unitId);
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
    addresseesForInternalDocs: new FormControl<string>('', {
      nonNullable: this.documentDirection() === 'internal' ? true : false,
      validators: Validators.required,
    }),
    addresseesForExternalDocs: new FormControl<string>('', {
      nonNullable: this.documentDirection() === 'external' ? true : false,
      validators: Validators.required,
    }),
  });

  isMinuting = false;
  minuteContentToBeAdded = signal<string>('');
  isMinuteAdded = computed(() => this.minuteContentToBeAdded().trim().length === 0);

  changeMinute(event: any) {
    const data = event.target.value;

    this.minuteContentToBeAdded.set(data);
  }

  searchUnitValue = signal<string>('');
  searchUnitMemberValue = signal<string>('');
  searchVolValue = signal<string>('');

  filteredUnits = computed(() => {
    const filterValue = this.searchUnitValue().toLowerCase();

    return this.units().filter((unit) => unit.fullName.toLowerCase().includes(filterValue));
  });

  filteredUnitsForCC = computed(() => {
    // exclude origin unit from the list
    return this.filteredUnits().filter((unit) => {
      const primaryAddresseeUnitId = this.primaryAddresseeForExternalDocs().id;

      unit.id !== primaryAddresseeUnitId;
    });
  });

  searchAddresseeValue = signal<string>('');
  updateAddressee(event: any) {
    const typedWord = event.target.value;

    this.searchAddresseeValue.set(typedWord);
  }

  filteredUnitMembers = computed(() => {
    const typedValue = this.searchAddresseeValue().toLowerCase();

    return (this.unitMembers() ?? [])
      .filter((member) => {
        // this excludes the current staff that is logged
        if (this.signedInStaff() && member.id === this.signedInStaff()?.id) return;

        // this removed staffs with null designation
        if (member.designation && member.designation.id)
          return member.designation.title.toLowerCase().includes(typedValue);
        else return;
      })
      .map((data) => {
        const { identityId, ...uiData } = data;
        return uiData;
      });
  });
  
  filteredUnitMembersForCC = computed(() => {
    // exclude primary addressee from the list
    return this.filteredUnitMembers().filter((member) => {
      const primaryAddresseeId = this.primaryAddresseeForInternalDocs().id;

      member.id !== primaryAddresseeId;
    });
  });

  primaryAddresseeForInternalDocs = computed(() => {
    const doc = this.document();

    if (!doc) return emptyDesignation;
    const designationId = doc.addressees.find((d) => d.isPrimary)!.addressedToDesignationId;

    return this.getDesignationFromId(designationId);
  });

  primaryAddresseeForExternalDocs = computed(() => {
    const doc = this.document();

    if (!doc) return emptyUnit;

    const unitId = doc.addressees.find((d) => d.isPrimary)!.recipientUnitId;

    return this.getUnitFromId(unitId);
  });


  designations = this.staffService.officesDesignations;
  getDesignationFromId(designationId: string) {
    return this.designations().find((d) => d.id === designationId) ?? emptyDesignation;
  }
  getUnitFromId(unitId: string) {
    return this.units().find((unit) => unit.id === unitId) ?? emptyUnit;
  }

  showDesignationTitleRatherThanId = (designationId: string) => {
    const designationTitle = this.getDesignationFromId(designationId).title;

    return `The ${designationTitle
      .split(' ')
      .map((title) => title[0].toUpperCase() + title.slice(1))
      .join(' ')}`;
  };

  selectedUnitsForCC = signal<string[]>([]);
  selectedDesignationsForCC = signal<string[]>([]);
  selectedDesig(event: MatAutocompleteSelectedEvent): void {
    this.selectedDesignationsForCC.update((selectedDesignationsForCC) => [
      ...selectedDesignationsForCC,
      event.option.viewValue,
    ]);

    event.option.deselect();
  }
  selectedUnit(event: MatAutocompleteSelectedEvent): void {
    this.selectedUnitsForCC.update((selectedUnitsForCC) => [
      ...selectedUnitsForCC,
      event.option.viewValue,
    ]);

    event.option.deselect();
  }

  removeDesig(designationId: string): void {
    this.selectedDesignationsForCC.update((selectedDesignationsForCC) => {
      const index = selectedDesignationsForCC.indexOf(designationId);
      if (index < 0) {
        return selectedDesignationsForCC;
      }

      selectedDesignationsForCC.splice(index, 1);
      return [...selectedDesignationsForCC];
    });
  }

  removeUnit(unitId: string): void {
    this.selectedUnitsForCC.update((selectedUnitsForCC) => {
      const index = selectedUnitsForCC.indexOf(unitId);
      if (index < 0) {
        return selectedUnitsForCC;
      }

      selectedUnitsForCC.splice(index, 1);
      return [...selectedUnitsForCC];
    });
  }

  updateUnitSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchUnitValue.set(value);
  }


  // scans for signature placeholder
  signaturePlaceholderBounds = computed(() => this.scanForSignaturePlaceholderAndReturnBounds());

  previewDocument() {
    // store previous zoom level
    this.previousZoomLevel.set(this.zoomLevel());

    //reset zoom level
    this.resetZoom();

    // // retrieve content as html
    // const htmlContent = this.retrieveEditorContentsAsSpecificType('html') as string;

    // this.editorHtmlContent.set(htmlContent);

    // checks if signature exists
    const signatureExists = this.signaturePlaceholderBounds().exists;

    this.documentService.setManualPrintPreview = true;
  }

  exitPreview() {
    // set current zoom level to the previous value
    this.zoomLevel.set(this.previousZoomLevel());

    this.paperViewControls.set(false);

    this.documentService.setManualPrintPreview = false;
  }

  printCorrespondence() {
    this.documentService.setManualPrintPreview = true;

    setTimeout(() => window.print(), 0);
  }

  paperViewControls = signal<boolean>(false);
  @ViewChild('workspaceRoot')
  workspaceRoot!: ElementRef<HTMLDivElement>;

  @ViewChild('addMinuteDialog')
  addMinuteDialog!: HlmAlertDialog;

  @ViewChild('forwardDocumentDialog')
  forwardDocumentDialog!: HlmAlertDialog;

  onMouseEnter() {
    if (this.isEligibleForPrintPreview()) {
      this.paperViewControls.set(true);
    }
  }

  onMouseLeave() {
    if (this.isEligibleForPrintPreview()) {
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

  isDocumentSaved = this.documentService.isDocumentSaved;
  saveDocumentLoading = this.documentService.saveDocumentLoading;
  saveDocument() {
    const openedDocument = this.document()!;
    const contentAsDelta = this.retrieveEditorContentsAsSpecificType('delta');
    const actorId = this.signedInStaff()?.id!;

    this.documentService.saveDocument(openedDocument.id, {
      document: openedDocument,
      contentDelta: contentAsDelta,
      actorId,
    });
  }

  submitDocument() {
    const staffId = this.signedInStaff()?.id!;
    const openedDocument = this.document()!;

    this.documentService.submitDocument(staffId, openedDocument);
  }

  DocumentSubmissionEffect = effect(() => {
    const submissionStatus = this.documentService.docSubmittedSuccess();

    if (submissionStatus) this.router.navigateByUrl('/office/documents');
  });

  resolveStaffDesignationTitle(staffId: string) {
    const signedInStaffId = this.signedInStaff()?.id;
    const staff = this.unitMembersService.data().find((member) => member.id === staffId);

    if (!staff || !signedInStaffId) return 'n/a';
    else if (signedInStaffId === staff.id) return 'you';

    return 'the ' + staff.designation.title;
  }

  resolveMinuteAction(action: MinuteAction) {
    switch (action) {
      case MinuteAction.ACKNOWLEDGE:
        return 'acknowledged';
      case MinuteAction.COMMENT:
        return 'minuted';
      default:
        return 'acknowledged';
    }
  }

  resolveMinuteContent(content: string | null) {
    if (!content) return '';

    return content;
  }

  formatDate = this.utilService.formatDateAsReadableString;

  forwardCorrespondenceFormGroup = new FormGroup({
    forwardToDesignationId: new FormControl<string>('', {
      nonNullable: true,
      validators: Validators.required,
    }),
  });

  getStaffMinuteIfExistsBefore() {
    const staffId = this.signedInStaff()?.id;

    if (!staffId)
      return {
        existsBefore: false,
        foundMinute: null,
      };

    const foundMinute = this.minutes().find((mn) => mn.authorStaffId === staffId);

    return foundMinute
      ? {
          existsBefore: true,
          foundMinute,
        }
      : {
          existsBefore: false,
          foundMinute: null,
        };
  }

  addMinuteToCorrespondence() {
    const openedDocument = this.document();
    const staffId = this.signedInStaff()?.id;
    const content = this.minuteContentToBeAdded().trim();

    if (!openedDocument || !staffId) return;
    const staffMinuteExistsBefore = this.getStaffMinuteIfExistsBefore();

    this.minutesService.addMinuteToCorrespondence(openedDocument.id, {
      authorStaffId: staffId,
      action: content.length === 0 ? MinuteAction.ACKNOWLEDGE : MinuteAction.COMMENT,
      content: content.length === 0 ? null : content,
      parentMinuteId: staffMinuteExistsBefore.existsBefore
        ? staffMinuteExistsBefore.foundMinute!.id
        : null,
    });

    this.minuteContentToBeAdded.set('');
    this.isMinuting = false;
  }

  isForwarding = false;
  forwardDocument() {
    const openedDocument = this.document();
    const staffId = this.signedInStaff()?.id;
    const forwardToDesignationId = this.forwardCorrespondenceFormGroup
      .getRawValue()
      .forwardToDesignationId.trim();
    const forwardToTitle =
      this.showDesignationTitleRatherThanId(forwardToDesignationId) || forwardToDesignationId;

    if (!openedDocument || !staffId || !forwardToDesignationId) return;

    this.minutesService.addMinuteToCorrespondence(openedDocument.id, {
      authorStaffId: staffId,
      action: MinuteAction.FORWARD,
      content: forwardToTitle,
    });

    this.addMinuteToCorrespondence();
  }
}

interface SignatureBounds {
  exists: boolean;
  details?: {
    begin: number;
    end: number;
  };
}
