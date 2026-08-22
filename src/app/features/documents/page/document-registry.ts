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
import { DatePipe } from '@angular/common';
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
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';
import type { EmptyStateConfig } from '../../../models/ui/global/EmptyState.ui';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { LineLoader } from '../../../shared/components/loaders/line-loader/line-loader';
import { UtilService } from '../../../shared/utils/service/util-service';
import { BusinessFunctionService } from '../service/business-function/business-function-service';
import { CorrespondenceSubjectService } from '../service/correspondence-subject/correspondence-subject-service';
import { DocumentTypesService } from '../service/document-types/document-types-service';
import { MinutesService } from '../service/minutes/minutes-service';
import { RegistryService } from '../service/registry/registry-service';
import { UnitMembersService } from '../service/unit-members/unit-members-service';
import { DocumentApi } from '../../../models/api/documents/Document.api';
import { UnitsApi } from '../../../models/api/organization/units.api';
import { SideModal } from '../../../shared/components/side-modal/side-modal';
import { DocumentDetails } from '../components/document-details/document-details';
import { DocumentItem } from '../components/document-item/document-item';
import { DocumentService } from '../service/document/document-service';
import { OrganizationService } from '../../shared/services/organization/organization-service';
import { CurrentStaffService } from '../../shared/services/current-staff/current-staff-service';
import { StaffService } from '../../../core/services/page-wide/dashboard/operations/hr/staff/staff-service';
import { SensitivityLevel } from '../../../enums/document/document.enum';
import { officeActivityContext } from '../../../office-platform/activity/office-activity.context';


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
    NgIcon,
    HlmInputGroup,
    HlmInputGroupAddon,
    EmptyState,
    
    BrnAlertDialogContent,
    BrnAlertDialogTrigger,
    HlmButton,
    ReactiveFormsModule,
    LineLoader,
    DocumentItem,
    DocumentDetails,
    SideModal,
    HlmSkeleton,
    DatePipe,
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
  readonly documentSkeletons = [1, 2, 3, 4];

  router = inject(Router);
  private currentStaffService = inject(CurrentStaffService);
  registryService = inject(RegistryService);
  businessFunctionService = inject(BusinessFunctionService);
  corrSubjectService = inject(CorrespondenceSubjectService);
  unitMembersService = inject(UnitMembersService);
  documentTypesService = inject(DocumentTypesService);
  organizationService = inject(OrganizationService);
  staffService = inject(StaffService);
  documentService = inject(DocumentService);
  minutesService = inject(MinutesService);
  activatedRouter = inject(ActivatedRoute);

  readonly signedInStaff = this.currentStaffService.data;

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
    this.corrSubjectService.fetchCorrSubjects(officeActivityContext());
    this.businessFunctionService.fetchBussFunctions(officeActivityContext());
    this.documentTypesService.fetchDocTypes(officeActivityContext());
    this.organizationService.fetchUnits(officeActivityContext());
    this.organizationService.fetchAllDesignations(officeActivityContext());
  }

  AfterInitEffect = effect(() => {
    const staff = this.signedInStaff();

    if (!staff) return;

    const currentMembers = this.unitMembersService.data();

    if (currentMembers.length === 0) {
      this.unitMembersService.fetchUnitMembers(staff.unit.id, officeActivityContext());
    }

    this.documentService.fetchDocumentsByStaff(staff.id, officeActivityContext());
  });

  searchQuery = signal<string>('');
  readonly searchResults = this.documentService.searchResults;
  readonly searchPageInfo = this.documentService.searchPageInfo;
  readonly searchLoading = this.documentService.searchLoading;
  readonly isSearching = computed(() => this.searchQuery().trim().length > 0);

  private readonly governedSearchEffect = effect((onCleanup) => {
    const query = this.searchQuery().trim();
    const timer = setTimeout(() => {
      if (query) {
        this.documentService.searchDocuments(query);
      } else {
        this.documentService.clearDocumentSearch();
      }
    }, 300);

    onCleanup(() => clearTimeout(timer));
  });

  emptyState = computed<EmptyStateConfig>(() => {
    const list = this.filteredDocumentsForPageViewAndSearchQuery() ?? [];
    const hasAnyDocuments = this.documents().length > 0;

    if (this.isSearching() && this.searchResults().length === 0) {
      return {
        kind: 'no-results',
        iconName: 'lucideSearchX',
        title: `No documents match “${this.searchQuery()}”`,
        description: 'Check the spelling, use fewer terms, or clear the search to restore every document.',
        actions: [{ id: 'clear-search', label: 'Clear search', appearance: 'secondary' }],
      };
    }

    if (!hasAnyDocuments) {
      return {
        kind: 'first-use',
        iconName: 'lucideFilePlusCorner',
        title: 'Your document workspace is ready',
        description:
          'Documents you create, submit, or receive access to will appear here with their complete governance history.',
        actions: [
          { id: 'create-document', label: 'Create first document', appearance: 'primary' },
        ],
      };
    }

    if (this.selectedViewMode() !== 'all' && list.length === 0) {
      const selectedLabel = this.viewChips.find((chip) => chip.value === this.selectedViewMode())?.label;
      return {
        kind: 'filtered',
        iconName: 'lucideFileSearch',
        title: `No ${selectedLabel?.toLowerCase() ?? 'matching'} documents`,
        description: 'Nothing currently meets this view’s criteria. Your other documents remain available.',
        actions: [{ id: 'show-all', label: 'Show all documents', appearance: 'secondary' }],
      };
    }

    return {
      kind: 'no-data',
      iconName: 'lucideArchive',
      title: 'No documents available',
      description: 'There are currently no documents available in this workspace.',
    };
  });

  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  loadMoreSearchResults(): void {
    const pageInfo = this.searchPageInfo();
    const query = this.searchQuery().trim();
    if (!query || !pageInfo?.hasMore || !pageInfo.nextCursor) return;

    this.documentService.searchDocuments(query, pageInfo.nextCursor, true);
  }

  openSearchResult(documentId: string): void {
    this.registryService.navigateToWorkspace(this.activatedRouter, documentId);
  }

  handleEmptyStateAction(action: string): void {
    if (action === 'create-document') this.documentTypeSelectionDialog.open();
    if (action === 'clear-search') this.searchQuery.set('');
    if (action === 'show-all') void this.setRegistryView('all');
  }

  setRegistryView(view: 'all' | 'draft' | 'in-progress' | 'shared') {
    return this.router.navigate([], {
      relativeTo: this.activatedRouter,
      queryParams: view === 'all' ? { view: null } : { view },
      queryParamsHandling: 'merge',
    });
  }

  loading = signal<boolean>(false);
  showLoader() {
    this.loading.set(true);
  }
  hideLoader() {
    this.loading.set(false);
  }

  docTypes = this.documentTypesService.allDocTypes;
  corrSubjects = this.corrSubjectService.corrSubjects;
  unitMembers = this.unitMembersService.data;
  orgUnits = this.organizationService.units;
  documents = this.documentService.staffDocuments;
  designations = this.organizationService.officesDesignations;

  filteredDocumentsForPageViewAndSearchQuery = computed(() => {
    const mode = this.viewMode();
    const docs = this.documents();
    const query = '';
    const staff = this.signedInStaff();

    if (!staff) return;

    const allDocs = [
      ...docs.map((doc) => ({ ...doc, shared: false }))
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

    const filteredSharedDocs = allDocs
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
      addressedToDesignationId =
        direction === 'external' ? null : docForm.getRawValue().addressedToDesignationId;

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

    if (error) this.hideLoader();
  });

  documentClicked = this.registryService.documentClicked;
  isDetailsOpen = this.registryService.isDetailsOpen;

  openDocPane(doc: DocumentApi) {
    this.registryService.openDocDetails(doc);
  }
}
