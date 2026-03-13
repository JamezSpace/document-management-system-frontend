import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentsUi } from '../../../../interfaces/departments/Department.ui';
import { EmptyStateInterface, EmptyStateType } from '../../../../interfaces/system/EmptyState.ui';
import { StaffService } from '../../../../services/page-wide/dashboard/document-workspace/staff/staff-service';
import { GenericDashboardService } from '../../../../services/page-wide/dashboard/generic/generic-dashboard-service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { BrnAlertDialogContent, BrnAlertDialogTrigger } from '@spartan-ng/brain/alert-dialog';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import {
  HlmInputGroupImports,
  HlmInputGroup,
  HlmInputGroupAddon,
} from '@spartan-ng/helm/input-group';
import { HlmMenubarImports } from '@spartan-ng/helm/menubar';
import { HlmNavigationMenuImports } from '@spartan-ng/helm/navigation-menu';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { EmptyState } from '../../../system-wide/empty-state/empty-state';
import { SpartanH3 } from '../../../system-wide/typography/spartan-h3/spartan-h3';
import { SpartanH4 } from '../../../system-wide/typography/spartan-h4/spartan-h4';
import { SpartanMuted } from '../../../system-wide/typography/spartan-muted/spartan-muted';
import { SpartanP } from '../../../system-wide/typography/spartan-p/spartan-p';
import { hugeGridView } from '@ng-icons/huge-icons';
import {
  lucideSearch,
  lucideArrowRight,
  lucideArrowDownUp,
  lucideChevronDown,
  lucideLayoutTemplate,
  lucideUpload,
  lucidePlus,
  lucideChevronLeft,
  lucideUsers2,
  lucideNetwork,
} from '@ng-icons/lucide';
import { CorrSubjectApi } from '../../../../interfaces/documents/corrSubject/corrSubject.api';
import { BusinessFunctionService } from '../../../../services/page-wide/dashboard/documents-registry/business-function/business-function-service';
import { CorrespondenceSubjectService } from '../../../../services/page-wide/dashboard/documents-registry/correspondence-subject/correspondence-subject-service';

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
  genericDashboardService = inject(GenericDashboardService);
  businessFunctionService = inject(BusinessFunctionService);
  corrSubjectService = inject(CorrespondenceSubjectService);
  staffService = inject(StaffService);

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

  showLoader() {
    this.genericDashboardService.loading.set(true);
  }

  processSelectionForDocumentCreation(dialog: any, selectionType: 'template' | 'upload') {
    // check what selection type is
    // if it is upload, then verify the document type uploaded and perform conversion where necessary
    // trigger backend to create new document
    // navigate to the document workspace
  }

  departments = this.genericDashboardService.departments;
  corrSubjects = this.corrSubjectService.data;
  selectedCorrSubject = signal<string | null>(null);
  filteredBussFunctions = computed(() => {
    if (!this.selectedCorrSubject()) return [];

    return this.businessFunctionService
      .data()
      .filter((func) => func.subjectId.endsWith(this.selectedCorrSubject()!));
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

  internalMemoFormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    to: new FormControl('', Validators.required),
    subjectCode: new FormControl('', Validators.required),
    functionCode: new FormControl('', Validators.required),
  });

  searchDeptValue = signal<string>('');
  updateDeptSearch(event: any) {
    const typedWord = event.target.value;

    this.searchDeptValue.set(typedWord);
  }
  filteredDepartments = computed(() => {
    const filterValue = this.searchDeptValue().toLowerCase();
    return this.departmentsView().filter((dept) => dept.label.toLowerCase().includes(filterValue));
  });

  officeMembers = this.genericDashboardService.officeMembers;
  searchOfficeMemberValue = signal<string>('');
  updateOfficeMember(event: any) {
    const typedWord = event.target.value;

    this.searchOfficeMemberValue.set(typedWord);
  }
  filteredOfficeMembers = computed(() => {
    const typedValue = this.searchOfficeMemberValue().toLowerCase();

    return this.officeMembers().filter((member) => {
      // this is to search both part of the name to see if either name starts with the search value
      const names = member.fullName.split(' ');
      let fullName = '';

      names.forEach((nm) => {
        if (nm.toLowerCase().startsWith(typedValue)) fullName = member.fullName;
      });

      return fullName;
    });
  });

  showLabelRatherThanId = (id: string) => {
    if (!id) return '';

    const member = this.officeMembers().find((m) => m.id === id);
    return member ? member.fullName : '';
  };
}
