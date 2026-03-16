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
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
import {
    CorrespondenceAddressee,
    SensitivityLevel,
} from '../../../../interfaces/documents/Document.enum';
import { DepartmentsUi } from '../../../../interfaces/org units/Department.ui';
import { EmptyStateInterface, EmptyStateType } from '../../../../interfaces/system/EmptyState.ui';
import { BusinessFunctionService } from '../../../../services/page-wide/dashboard/documents-registry/business-function/business-function-service';
import { CorrespondenceSubjectService } from '../../../../services/page-wide/dashboard/documents-registry/correspondence-subject/correspondence-subject-service';
import { DocumentTypesService } from '../../../../services/page-wide/dashboard/documents-registry/document-types/document-types-service';
import { OrgUnitsService } from '../../../../services/page-wide/dashboard/documents-registry/org-units/org-units-service';
import { UnitMembersService } from '../../../../services/page-wide/dashboard/documents-registry/unit-members/unit-members-service';
import { DocumentsService } from '../../../../services/page-wide/dashboard/generic/documents/documents-service';
import { GenericDashboardService } from '../../../../services/page-wide/dashboard/generic/generic-dashboard-service';
import { StaffDetailsService } from '../../../../services/page-wide/dashboard/office-template/staff-details-service';
import { UtilService } from '../../../../services/system-wide/util-service/util-service';
import { EmptyState } from '../../../system-wide/empty-state/empty-state';
import { LineLoader } from '../../../system-wide/loaders/line-loader/line-loader';
import { SpartanH3 } from '../../../system-wide/typography/spartan-h3/spartan-h3';
import { SpartanH4 } from '../../../system-wide/typography/spartan-h4/spartan-h4';
import { SpartanMuted } from '../../../system-wide/typography/spartan-muted/spartan-muted';
import { SpartanP } from '../../../system-wide/typography/spartan-p/spartan-p';

@Component({
  selector: 'nexus-document-registry',
  imports: [
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
  private staffDetService = inject(StaffDetailsService);
  genericDashboardService = inject(GenericDashboardService);
  businessFunctionService = inject(BusinessFunctionService);
  corrSubjectService = inject(CorrespondenceSubjectService);
  unitMembersService = inject(UnitMembersService);
  documentTypesService = inject(DocumentTypesService);
  orgUnitService = inject(OrgUnitsService);
  documentService = inject(DocumentsService);

  readonly signedInStaff = this.staffDetService.data;

  activatedRouter = inject(ActivatedRoute);
  router = inject(Router);

  directories = signal<string[]>([]);
  ngOnInit(): void {
    const currentPath = this.activatedRouter.snapshot.url.toString();

    this.directories.update((prev_directories) => [...prev_directories, currentPath]);

    // document init deps
    this.corrSubjectService.fetchCorrSubjects();
    this.businessFunctionService.fetchBussFunctions();
    this.documentTypesService.fetchDocTypes();
    this.orgUnitService.fetchOrgUnits();
  }

  private afterInitEffect = effect(() => {
    const staff = this.signedInStaff();

    if (!staff) return;

    const currentMembers = this.unitMembersService.data();

    if (currentMembers.length === 0) {
      this.unitMembersService.fetchUnitMembers(staff.unit.id);
    }

    this.documentService.fetchDocsByStaff(staff.id)
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

  navigateToWorkspace(documentId: string) {
    this.router.navigate(['workspace', documentId], { relativeTo: this.activatedRouter });
  }

  loading = signal<boolean>(false);
  showLoader() {
    this.loading.set(true);
  }

  hideLoader() {
    this.loading.set(false);
  }

  docTypes = this.documentTypesService.data;
  corrSubjects = this.corrSubjectService.data;
  unitMembers = this.unitMembersService.data;
  orgUnits = this.orgUnitService.data;
  documents = this.documentService.staffDocuments;

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

  departments = this.genericDashboardService.departments;
  selectedCorrSubject = signal<any>(null);
  filteredBussFunctions = computed(() => {
    if (!this.selectedCorrSubject()) return [];

    return this.businessFunctionService
      .data()
      .filter((func) => func.subjectId === this.selectedCorrSubject().id);
  });

  onSubjectSelection(selectedSubject: any) {
    this.selectedCorrSubject.set(selectedSubject);
  }

  departmentsView = signal<DepartmentsUi[]>([]);
  onCategoryChange(selectedCategory: any) {
    this.departmentsView.set(
      this.departments().filter((dept) => dept.category === selectedCategory),
    );

    // disables the 'disable' state on the field
    this.initDocFormGroup.controls.to.enable({ emitEvent: false });
  }

  currentYear = new Date().getFullYear();

  sensitivityLevels = Object.values(SensitivityLevel);
  initDocFormGroup = new FormGroup({
    title: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    to: new FormControl<string>(
      {
        value: '',
        disabled: this.initDocument()?.direction === 'external' && this.orgUnits().length === 0,
      },
      { nonNullable: true, validators: Validators.required },
    ),
    subjectCodeObject: new FormControl<any>('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    functionCodeObject: new FormControl<any>('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    sensitivity: new FormControl<SensitivityLevel>(SensitivityLevel.INTERNAL, {
      nonNullable: true,
      validators: Validators.required,
    }),
  });

  submitDocInitData() {
    this.showLoader();

    if (!this.initDocument()) return;

    const recipientId = this.initDocFormGroup.getRawValue().to,
      functionCodeObject = this.initDocFormGroup.getRawValue().functionCodeObject,
      subjectCodeObject = this.initDocFormGroup.getRawValue().subjectCodeObject,
      title = this.initDocFormGroup.getRawValue().title,
      sensitivity = this.initDocFormGroup.getRawValue().sensitivity.toLowerCase(),
      functionCodeId = functionCodeObject.id,
      functionCode = functionCodeObject.code,
      subjectCodeId = subjectCodeObject.id,
      subjectCode = subjectCodeObject.code,
      recipient = this.unitMembers().find((member) => member.id === recipientId),
      originatingUnitId = this.signedInStaff()?.unit.id!,
      addressedTo =
        this.initDocument()?.direction === 'internal'
          ? CorrespondenceAddressee.UNIT
          : CorrespondenceAddressee.EXTERNAL,
      documentTypeId = this.initDocument()?.docTypeId!,
      direction = this.initDocument()?.direction!;

    this.documentService.initDocument({
      title,
      documentTypeId,
      direction,
      addressedTo,
      functionCode,
      functionCodeId,
      subjectCode,
      subjectCodeId,
      sensitivity,
      originatingUnitId,
      recipientUnitId: recipient?.unit.id!,
      createdBy: this.signedInStaff()?.id!,
    });
  }

  InitDocumentApiPayloadEffect = effect(() => {
    const data = this.documentService.newDocument();
    const error = this.documentService.error();

    this.hideLoader();

    if (data) {
      this.router.navigate(['workspace', this.documentService.newDocument()?.id], {
        relativeTo: this.activatedRouter,
      });
    }

    if (error) {
      this.hideLoader();

      this.utilService.showToast(error.code.httpStatusCode === 500 ? 'Internal Server Error' : error.context.message);
    }
  });

  searchUnitValue = signal<string>('');
  updateUnitSearch(event: any) {
    const typedWord = event.target.value;

    this.searchUnitValue.set(typedWord);
  }
  filteredUnits = computed(() => {
    const filterValue = this.searchUnitValue().toLowerCase();

    return this.orgUnits().filter((unit) => unit.fullName.toLowerCase().includes(filterValue));
  });

  searchAddresseeNameValue = signal<string>('');
  updateAddresseeName(event: any) {
    const typedWord = event.target.value;

    this.searchAddresseeNameValue.set(typedWord);
  }

  filteredUnitMembers = computed(() => {
    const typedValue = this.searchAddresseeNameValue().toLowerCase();

    return (this.unitMembers() ?? [])
      .filter((member) => member.fullName.toLowerCase().includes(typedValue))
      .map((data) => {
        const { identityId, ...uiData } = data;
        return uiData;
      });
  });

  showLabelRatherThanId = (id: string) => {
    if (!id) return '';

    const member = this.unitMembers().find((m) => m.id === id);
    return member?.fullName ?? '';
  };
}
