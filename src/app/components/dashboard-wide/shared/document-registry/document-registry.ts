import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
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
  lucideLayoutTemplate,
  lucideNetwork,
  lucidePlus,
  lucideSearch,
  lucideUpload,
  lucideUsers2,
} from '@ng-icons/lucide';
import { BrnAlertDialogContent, BrnAlertDialogTrigger } from '@spartan-ng/brain/alert-dialog';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
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
import { DepartmentsUi } from '../../../../interfaces/departments/Department.ui';
import { SensitivityLevel } from '../../../../interfaces/documents/Document.enum';
import { EmptyStateInterface, EmptyStateType } from '../../../../interfaces/system/EmptyState.ui';
import { BusinessFunctionService } from '../../../../services/page-wide/dashboard/documents-registry/business-function/business-function-service';
import { CorrespondenceSubjectService } from '../../../../services/page-wide/dashboard/documents-registry/correspondence-subject/correspondence-subject-service';
import { UnitMembersService } from '../../../../services/page-wide/dashboard/documents-registry/unit-members/unit-members-service';
import { GenericDashboardService } from '../../../../services/page-wide/dashboard/generic/generic-dashboard-service';
import { InternalMemoService } from '../../../../services/page-wide/dashboard/generic/internal-memo/internal-memo-service';
import { StaffDetailsService } from '../../../../services/page-wide/dashboard/office-template/staff-details-service';
import { EmptyState } from '../../../system-wide/empty-state/empty-state';
import { SpartanH3 } from '../../../system-wide/typography/spartan-h3/spartan-h3';
import { SpartanH4 } from '../../../system-wide/typography/spartan-h4/spartan-h4';
import { SpartanMuted } from '../../../system-wide/typography/spartan-muted/spartan-muted';
import { SpartanP } from '../../../system-wide/typography/spartan-p/spartan-p';
import { LineLoader } from '../../../system-wide/loaders/line-loader/line-loader';
import { UtilService } from '../../../../services/system-wide/util-service/util-service';

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
  genericDashboardService = inject(GenericDashboardService);
  private staffDetService = inject(StaffDetailsService);
  businessFunctionService = inject(BusinessFunctionService);
  corrSubjectService = inject(CorrespondenceSubjectService);
  unitMembersService = inject(UnitMembersService);
  internalMemoService = inject(InternalMemoService);

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
  }

  private loadUnitMembersEffect = effect(() => {
    const staff = this.signedInStaff();

    if (!staff) return;

    const currentMembers = this.unitMembersService.data();

    if (currentMembers.length === 0) {
      this.unitMembersService.fetchUnitMembers(staff.unit.id);
    }
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

  documents = signal<any[]>([]);

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

  processSelectionForDocumentCreation(dialog: any, selectionType: 'template' | 'upload') {
    // check what selection type is
    // if it is upload, then verify the document type uploaded and perform conversion where necessary
    // trigger backend to create new document
    // navigate to the document workspace
  }

  departments = this.genericDashboardService.departments;
  corrSubjects = this.corrSubjectService.data;
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
    this.externalMemoFormGroup.controls.to.enable({ emitEvent: false });
  }

  currentYear = new Date().getFullYear();

  externalMemoFormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    to: new FormControl(
      { value: '', disabled: this.departmentsView().length === 0 },
      Validators.required,
    ),
    subjectCode: new FormControl('', Validators.required),
    functionCode: new FormControl('', Validators.required),
  });

  sensitivityLevels = Object.values(SensitivityLevel);
  internalMemoFormGroup = new FormGroup({
    title: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    to: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
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

  submitInternalMemoData() {
    this.showLoader();

    const recipientId = this.internalMemoFormGroup.getRawValue().to,
      functionCodeObject = this.internalMemoFormGroup.getRawValue().functionCodeObject,
      subjectCodeObject = this.internalMemoFormGroup.getRawValue().subjectCodeObject,
      title = this.internalMemoFormGroup.getRawValue().title,
      sensitivity = this.internalMemoFormGroup.getRawValue().sensitivity.toLowerCase(),
      functionCodeId = functionCodeObject.id,
      functionCode = functionCodeObject.code,
      subjectCodeId = subjectCodeObject.id,
      subjectCode = subjectCodeObject.code,
      recipient = this.unitMembers().find((member) => member.id === recipientId),
      originatingUnitId = this.signedInStaff()?.unit.id!;

    const response = this.internalMemoService.initInternalMemo({
      title,
      functionCode,
      functionCodeId,
      subjectCode,
      subjectCodeId,
      sensitivity,
      originatingUnitId,
      recipientUnitId: recipient?.unit.id!,
      createdBy: this.signedInStaff()?.id!,
    });

    if (!response.success) {
      this.hideLoader();
      this.utilService.showToast(this.internalMemoService.error());
      return;
    }

    this.router.navigate(['workspace', this.internalMemoService.data()?.id], {
      relativeTo: this.activatedRouter,
    });
  }

  searchDeptValue = signal<string>('');
  updateDeptSearch(event: any) {
    const typedWord = event.target.value;

    this.searchDeptValue.set(typedWord);
  }
  filteredDepartments = computed(() => {
    const filterValue = this.searchDeptValue().toLowerCase();
    return this.departmentsView().filter((dept) => dept.label.toLowerCase().includes(filterValue));
  });

  unitMembers = this.unitMembersService.data;
  searchOfficeMemberValue = signal<string>('');
  updateUnitMemberName(event: any) {
    const typedWord = event.target.value;

    this.searchOfficeMemberValue.set(typedWord);
  }

  filteredUnitMembers = computed(() => {
    const typedValue = this.searchOfficeMemberValue().toLowerCase();

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
