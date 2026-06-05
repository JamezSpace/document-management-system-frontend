import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    OnInit,
    signal,
    ViewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { hugeGridView } from '@ng-icons/huge-icons';
import {
    lucideArrowDownUp,
    lucideArrowRight,
    lucideChevronDown,
    lucideChevronLeft,
    lucideFileInput,
    lucideFileOutput,
    lucideFileText,
    lucideLayoutTemplate,
    lucideMail,
    lucideNetwork,
    lucidePlus,
    lucideSearch,
    lucideStickyNote,
    lucideUpload,
    lucideUsers2,
} from '@ng-icons/lucide';
import { BrnAlertDialogContent, BrnAlertDialogTrigger } from '@spartan-ng/brain/alert-dialog';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmAlertDialog, HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import {
    HlmInputGroup,
    HlmInputGroupAddon,
    HlmInputGroupImports,
} from '@spartan-ng/helm/input-group';
import { HlmMenubarImports } from '@spartan-ng/helm/menubar';
import { HlmNavigationMenuImports } from '@spartan-ng/helm/navigation-menu';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { DocumentApi } from '../../../../interfaces/api/documents/Document.api';
import { SensitivityLevel } from '../../../../enum/document/document.enum';
import { UnitsApi } from '../../../../interfaces/api/org units/units.api';
import {
    EmptyStateInterface,
    EmptyStateType,
} from '../../../../interfaces/ui/global/EmptyState.ui';
import { BusinessFunctionService } from '../../../../services/page-wide/dashboard/documents-registry/business-function/business-function-service';
import { CorrespondenceSubjectService } from '../../../../services/page-wide/dashboard/documents-registry/correspondence-subject/correspondence-subject-service';
import { DocumentTypesService } from '../../../../services/page-wide/dashboard/documents-registry/document-types/document-types-service';
import { OrgUnitsService } from '../../../../services/page-wide/dashboard/documents-registry/org-units/org-units-service';
import { RegistryService } from '../../../../services/page-wide/dashboard/documents-registry/registry/registry-service';
import { UnitMembersService } from '../../../../services/page-wide/dashboard/documents-registry/unit-members/unit-members-service';
import { DocumentsService } from '../../../../services/page-wide/dashboard/generic/documents/documents-service';
import { GenericDashboardService } from '../../../../services/page-wide/dashboard/generic/generic-dashboard-service';
import { StaffDetailsService } from '../../../../services/page-wide/dashboard/office-template/staff-details-service';
import { StaffService } from '../../../../services/page-wide/dashboard/operations/hr/staff/staff-service';
import { UtilService } from '../../../../services/system-wide/util-service/util-service';
import { EmptyState } from '../../../system-wide/empty-state/empty-state';
import { LineLoader } from '../../../system-wide/loaders/line-loader/line-loader';
import { SpartanH3 } from '../../../system-wide/typography/spartan-h3/spartan-h3';
import { SpartanH4 } from '../../../system-wide/typography/spartan-h4/spartan-h4';
import { SpartanMuted } from '../../../system-wide/typography/spartan-muted/spartan-muted';
import { SpartanP } from '../../../system-wide/typography/spartan-p/spartan-p';
import { DocumentDetails } from '../document-details/document-details';
import { DocumentItem } from '../document-item/document-item';
import { SideModal } from '../side-modal/side-modal';
import { MinutesService } from '../../../../services/page-wide/dashboard/documents-registry/minutes/minutes-service';

@Component({
  selector: 'nexus-document-registry',
  imports: [
    MatSidenavModule,
    MatAutocompleteModule,
    HlmSelectImports,
    HlmComboboxImports,
    HlmInputGroupImports,
    HlmAlertDialogImports,
    HlmBreadCrumbImports,
    HlmSeparatorImports,
    HlmDropdownMenuImports,
    HlmNavigationMenuImports,
    HlmMenubarImports,
    HlmTooltipImports,
    SpartanH3,
    SpartanH4,
    SpartanP,
    SpartanMuted,
    NgIcon,
    HlmInputGroup,
    HlmInputGroupAddon,
    EmptyState,
    BrnSelectImports,
    BrnAlertDialogContent,
    BrnAlertDialogTrigger,
    HlmButton,
    ReactiveFormsModule,
    LineLoader,
    DocumentItem,
    DocumentDetails,
    SideModal,
  ],
  templateUrl: './document-registry.html',
  styleUrl: './document-registry.css',
  providers: [
    provideIcons({
      lucideSearch,
      lucideStickyNote,
      lucideMail,
      lucideFileText,
      lucideFileInput,
      lucideFileOutput,
      lucideArrowRight,
      lucideArrowDownUp,
      hugeGridView,
      lucideChevronDown,
      lucideLayoutTemplate,
      lucideUpload,
      lucidePlus,
      lucideChevronLeft,
      lucideUsers2,
      lucideNetwork,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentRegistry implements OnInit {
  private utilService = inject(UtilService);
  private staffDetailsService = inject(StaffDetailsService);
  registryService = inject(RegistryService);
  genericDashboardService = inject(GenericDashboardService);
  businessFunctionService = inject(BusinessFunctionService);
  corrSubjectService = inject(CorrespondenceSubjectService);
  unitMembersService = inject(UnitMembersService);
  documentTypesService = inject(DocumentTypesService);
  orgUnitService = inject(OrgUnitsService);
  staffService = inject(StaffService);
  documentService = inject(DocumentsService);
  minutesService = inject(MinutesService);
  activatedRouter = inject(ActivatedRoute);
  router = inject(Router);

  readonly signedInStaff = this.staffDetailsService.data;

  private queryParams = toSignal(this.activatedRouter.queryParamMap);
  viewMode = computed(() => this.queryParams()?.get('view'));
  selectedViewMode = computed(() => this.viewMode() ?? 'all');

  viewChips: Array<{ label: string; value: 'all' | 'draft' | 'in-progress' | 'shared' }> = [
    { label: 'All', value: 'all' },
    { label: 'Drafts', value: 'draft' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Shared', value: 'shared' },
  ];

  directories = signal<string[]>([]);
  ngOnInit(): void {
    const currentPath = this.activatedRouter.snapshot.url.toString();

    this.directories.set(currentPath.split(','));

    // document init deps
    this.corrSubjectService.fetchCorrSubjects();
    this.businessFunctionService.fetchBussFunctions();
    this.documentTypesService.fetchDocTypes();
    this.orgUnitService.fetchOrgUnits();
    this.staffService.fetchAllDesignations();
  }

  private afterInitEffect = effect(() => {
    const staff = this.signedInStaff();

    if (!staff) return;

    const currentMembers = this.unitMembersService.data();

    if (currentMembers.length === 0) {
      this.unitMembersService.fetchUnitMembers(staff.unit.id);
    }

    this.documentService.fetchDocumentsAuthoredByStaff(staff.id);
    this.documentService.fetchAddressedToStaff(staff.id);
  });

  emptyStateDataAsFistTime: EmptyStateInterface = {
    type: EmptyStateType.FIRST_TIME,
    iconName: 'lucideFilePlusCorner',
    title: 'No Documents Yet',
    supportingText:
      'This workspace will list documents you create, submit, or are granted access to. All document actions are logged and governed by policy.',
    actions: [
      {
        label: 'Create New Document',
        route: 'new',
      },
    ],
  };

  emptyStateDataAsNoData: EmptyStateInterface = {
    type: EmptyStateType.NO_DATA,
    iconName: 'lucideFileMinus',
    title: 'No Documents Available',
    supportingText: 'There are no documents available in this workspace.',
    actions: [
      {
        label: 'Create New Document',
        route: 'new',
      },
    ],
  };

  emptyState = computed(() => {
    const list = this.filteredDocumentsForPageViewAndSearchQuery() ?? [];
    const hasAnyDocuments = [...this.documents(), ...this.sharedDocuments()].length > 0;

    if (!hasAnyDocuments) {
      return this.emptyStateDataAsFistTime;
    }

    if (this.searchQuery() && list.length === 0) {
      return this.emptyStateDataAsNoData;
    }

    // fail-safe
    return this.emptyStateDataAsNoData;
  });

  searchQuery = signal<string>('');
  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  setRegistryView(view: 'all' | 'draft' | 'in-progress' | 'shared') {
    return this.router.navigate([], {
      relativeTo: this.activatedRouter,
      queryParams: view === 'all' ? { view: null } : { view },
      queryParamsHandling: 'merge',
    });
  }

  loading = signal<boolean>(false);
  pageLoading = this.genericDashboardService.loading;
  showLoader() {
    this.loading.set(true);
  }
  showPageLoader() {
    this.pageLoading.set(true);
  }
  hideLoader() {
    this.loading.set(false);
  }
  hidePageLoader() {
    this.pageLoading.set(false);
  }

  docTypes = this.documentTypesService.allDocTypes;
  corrSubjects = this.corrSubjectService.corrSubjects;
  unitMembers = this.unitMembersService.data;
  orgUnits = this.orgUnitService.units;
  documents = this.documentService.staffDocuments;
  sharedDocuments = this.documentService.sharedDocuments;
  designations = this.staffService.officesDesignations;

  filteredDocumentsForPageViewAndSearchQuery = computed(() => {
    const mode = this.viewMode();
    const docs = this.documents();
    const sharedDocs = this.sharedDocuments();
    const query = this.searchQuery().toLowerCase();
    const staff = this.signedInStaff();

    if (!staff) return;

    const allDocs = [
      ...docs.map((doc) => ({ ...doc, shared: false })),
      ...sharedDocs.map((doc) => ({ ...doc, shared: true })),
    ].filter(
      (doc, index, self) =>
        self.findIndex((candidate) => candidate.id === doc.id) === index,
    );

    const filteredAllDocs = allDocs.filter(
      (doc) =>
        doc.title.toLowerCase().includes(query) ||
        doc.referenceNumber?.toLowerCase().includes(query) ||
        doc.classification.documentTypeId.toLowerCase().includes(query) ||
        doc.correspondence.subjectCodeId.toLowerCase().includes(query),
    );

    const filteredSharedDocs = sharedDocs
      .filter(
        (doc) =>
          doc.title.toLowerCase().includes(query) ||
          doc.referenceNumber?.toLowerCase().includes(query) ||
          doc.classification.documentTypeId.toLowerCase().includes(query) ||
          doc.correspondence.subjectCodeId.toLowerCase().includes(query),
      )
      .map((doc) => ({ ...doc, shared: true }));

    switch (mode) {
      case 'draft':
        const drafts = docs.filter(
          (doc) => doc.currentVersion?.lifecycle.currentState.toLowerCase() === 'draft',
        );

        return drafts.filter(
          (doc) =>
            doc.title.toLowerCase().includes(query) ||
            doc.referenceNumber?.toLowerCase().includes(query) ||
            doc.classification.documentTypeId.toLowerCase().includes(query) ||
            doc.correspondence.subjectCodeId.toLowerCase().includes(query),
        );
      case 'in-progress':
        const nonDrafts = docs.filter(
          (doc) => doc.currentVersion?.lifecycle.currentState.toLowerCase() !== 'draft',
        );

        return nonDrafts.filter(
          (doc) =>
            doc.title.toLowerCase().includes(query) ||
            doc.referenceNumber?.toLowerCase().includes(query) ||
            doc.classification.documentTypeId.toLowerCase().includes(query) ||
            doc.correspondence.subjectCodeId.toLowerCase().includes(query),
        );
      case 'shared':
        return filteredSharedDocs;
      case null:
        return filteredAllDocs;
      default:
        return filteredAllDocs;
    }
  });

  documentLoadingEffect = effect(() => {
    if (this.documentService.loading()) this.showPageLoader();
    else this.hidePageLoader();
  });

  initDocument = signal<{
    docTypeId: string;
    docType: string;
    direction: string;
  } | null>(null);

  @ViewChild('documentTypeSelectionDialog')
  private documentTypeSelectionDialog!: HlmAlertDialog;
  setDocTypeSelected(typeId: string, type: string) {
    this.initDocument.set({
      docTypeId: typeId,
      docType: type,
      direction: '',
    });

    this.documentTypeSelectionDialog.close();
  }

  @ViewChild('documentTypeSelectionDialog')
  private documentDirectionSelectionDialog!: HlmAlertDialog;
  setDirectionSelected(direction: string) {
    this.initDocument.update((doc) => {
      if (!doc) return null;

      return {
        ...doc,
        direction: direction,
      };
    });

    this.documentDirectionSelectionDialog.close();
  }

  selectedCorrSubject = signal<any>(null);
  filteredBussFunctions = computed(() => {
    if (!this.selectedCorrSubject()) return [];

    return this.businessFunctionService
      .bussFunctions()
      .filter((func) => func.subjectId === this.selectedCorrSubject().id);
  });

  onSubjectSelection(selectedSubject: any) {
    this.selectedCorrSubject.set(selectedSubject);
  }

  unitsView = signal<UnitsApi[]>([]);
  onCategoryChange(selectedCategory: any) {
    this.unitsView.set(
      // that is, for the external memo, only pick out the units that belong to the selected category and are not the current unit of the staff
      this.orgUnits().filter(
        (unit) => unit.sector === selectedCategory && unit.id !== this.signedInStaff()?.unit.id,
      ),
    );

    // disables the 'disable' state on the field
    // this.initDocFormGroup.controls.addressedTostaffId.enable({ emitEvent: false });
  }

  searchUnitValue = signal<string>('');
  updateUnitSearch(event: any) {
    const typedWord = event.target.value;

    this.searchUnitValue.set(typedWord);
  }
  filteredUnits = computed(() => {
    const filterValue = this.searchUnitValue().toLowerCase();

    return this.unitsView().filter((unit) => unit.fullName.toLowerCase().includes(filterValue));
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

  showDesignationTitleRatherThanId = (designationId: string) => {
    const designation = this.designations().find((desig) => desig.id === designationId);
    const designationTitle = designation?.title;

    if (!designationTitle) return '';

    return `The ${designationTitle
      .split(' ')
      .map((title) => title[0].toUpperCase() + title.slice(1))
      .join(' ')}`;
  };

  showUnitLabelRatherThanId = (unitId: string) => {
    if (!unitId) return '';

    const unit = this.orgUnits().find((unit) => unit.id === unitId);
    return unit?.code ?? '';
  };

  currentYear = new Date().getFullYear();

  sensitivityLevels = computed(() => {
    const allSensitivityLevels = Object.values(SensitivityLevel);

    return this.initDocument()?.direction === 'internal'
      ? allSensitivityLevels.filter((level) => level !== SensitivityLevel.PUBLIC)
      : allSensitivityLevels.filter((level) => level !== SensitivityLevel.INTERNAL);
  });

  initDocFormGroup = new FormGroup({
    title: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    recipientUnitId: new FormControl<string>('', {
      nonNullable: this.initDocument()?.direction === 'internal' ? false : true,
      validators: Validators.required,
    }),
    addressedToDesignationId: new FormControl<string>('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    subjectCodeObject: new FormControl<any>('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    functionCodeObject: new FormControl<any>('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    sensitivity: new FormControl<SensitivityLevel>(
      SensitivityLevel.INTERNAL || SensitivityLevel.PUBLIC,
      {
        nonNullable: true,
        validators: Validators.required,
      },
    ),
  });

  submitDocInitData() {
    this.showLoader();

    const staff = this.signedInStaff();
    const initializedDoc = this.initDocument();
    if (!initializedDoc || !staff) return;

    const docForm = this.initDocFormGroup;

    const originatingUnitId = staff.unit.id!,
      recipientUnitId =
        initializedDoc.direction === 'internal'
          ? originatingUnitId
          : docForm.getRawValue().recipientUnitId!,
      functionCodeObject = docForm.getRawValue().functionCodeObject,
      functionCodeId = functionCodeObject.id,
      functionCode = functionCodeObject.code,
      subjectCodeObject = docForm.getRawValue().subjectCodeObject,
      subjectCodeId = subjectCodeObject.id,
      subjectCode = subjectCodeObject.code,
      title = docForm.getRawValue().title,
      sensitivity = docForm.getRawValue().sensitivity.toLowerCase(),
      direction = initializedDoc.direction,
      documentTypeId = initializedDoc.docTypeId,
      addressedToDesignationId = docForm.getRawValue().addressedToDesignationId;

    this.documentService.initDocument({
      title,
      documentTypeId,
      direction,
      originatingUnitId,
      recipientUnitId,
      addressedToDesignationId,
      subjectCodeId,
      subjectCode,
      functionCodeId,
      functionCode,
      sensitivity,
      createdBy: staff!.id,
    });
  }

  InitDocumentApiPayloadEffect = effect(() => {
    const data = this.documentService.document();
    const error = this.documentService.error();

    this.hideLoader();

    if (data) {
      this.router.navigate(['workspace', this.documentService.document()?.id], {
        relativeTo: this.activatedRouter,
      });
    }

    if (error) {
      this.hideLoader();

      this.utilService.showToast(
        'error',
        error.code.httpStatusCode === 500 ? 'Internal Server Error' : error.context.message,
      );
    }
  });

  documentClicked = this.registryService.documentClicked;
  isDetailsOpen = this.registryService.isDetailsOpen;

  openDocPane(doc: DocumentApi) {
    this.registryService.openDocDetails(doc);
  }
}
