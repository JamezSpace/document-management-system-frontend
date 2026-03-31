import { Component, computed, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowDownUp, lucideHash, lucidePlus, lucideSearch } from '@ng-icons/lucide';
import { BrnAlertDialogContent, BrnAlertDialogTrigger } from '@spartan-ng/brain/alert-dialog';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmInputImports } from '@spartan-ng/helm/input';
import {
    HlmInputGroup,
    HlmInputGroupAddon,
    HlmInputGroupImports,
} from '@spartan-ng/helm/input-group';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmMenubarImports } from '@spartan-ng/helm/menubar';
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { StaffListView } from "../../../../../../components/dashboard-wide/operations/staff-list-view/staff-list-view";
import { EmptyState } from "../../../../../../components/system-wide/empty-state/empty-state";
import { SpartanH3 } from '../../../../../../components/system-wide/typography/spartan-h3/spartan-h3';
import { SpartanH4 } from '../../../../../../components/system-wide/typography/spartan-h4/spartan-h4';
import { SpartanMuted } from '../../../../../../components/system-wide/typography/spartan-muted/spartan-muted';
import { SpartanP } from '../../../../../../components/system-wide/typography/spartan-p/spartan-p';
import { EmploymentType } from '../../../../../../enum/staff/employmentType.enum';
import {
    EmptyStateInterface,
    EmptyStateType,
} from '../../../../../../interfaces/system/EmptyState.ui';
import { StaffDetailsService } from '../../../../../../services/page-wide/dashboard/office-template/staff-details-service';
import { StaffService } from '../../../../../../services/page-wide/dashboard/operations/hr/staff/staff-service';
import { UtilService } from '../../../../../../services/system-wide/util-service/util-service';

@Component({
  selector: 'nexus-staff-registry',
  imports: [
    MatStepperModule,
    SpartanH4,
    SpartanH3,
    SpartanP,
    SpartanMuted,
    BrnSelectImports,
    BrnAlertDialogContent,
    BrnAlertDialogTrigger,
    HlmInputGroupImports,
    HlmInputGroup,
    HlmInputGroupAddon,
    HlmRadioGroupImports,
    HlmAlertDialogImports,
    HlmMenubarImports,
    HlmDropdownMenuImports,
    HlmSelectImports,
    HlmInputImports,
    HlmLabelImports,
    HlmSeparator,
    ReactiveFormsModule,
    NgIcon,
    EmptyState,
    StaffListView
],
  templateUrl: './staff-registry.html',
  styleUrl: './staff-registry.css',
  providers: [
    provideIcons({
      lucidePlus,
      lucideSearch,
      lucideArrowDownUp,
      lucideHash,
    }),
  ],
})
export class StaffRegistry implements OnInit {
  utilService = inject(UtilService);
  staffService = inject(StaffService);
  staffDetService = inject(StaffDetailsService);

  readonly loggedInStaff = this.staffDetService.data()!

  directories = signal<string[]>([]);
  isMobile = this.utilService.isMobile;

  staffRegistryFirstTime: EmptyStateInterface = {
    type: EmptyStateType.FIRST_TIME,
    iconName: 'lucideUserPlus',
    title: 'Empty Registry',
    supportingText:
      'Start building your organization by adding staff members. You can manually create profiles or bulk-import data from your HR system.',
    actions: [
      {
        label: 'Add First Staff Member',
        route: '/registry/add',
      },
    ],
  };

  staffRegistryNoResults: EmptyStateInterface = {
    type: EmptyStateType.NO_DATA,
    iconName: 'lucideUsers',
    title: 'No Staff Found',
    supportingText:
      'We couldn’t find any staff members matching your current filters. Try adjusting your search terms or clearing the department filter.',
    actions: [
      {
        label: 'Clear All Filters',
        route: '/registry',
      },
    ],
  };

  ngOnInit(): void {
    // staff init deps
    this.staffService.fetchAllStaff();
    this.staffService.fetchAllOffices();
    this.staffService.fetchAllDesignations();
  }

  staff = this.staffService.staff;
  offices = this.staffService.officesInUnit;
  officesDesignations = this.staffService.officeDesignations;
  employmentTypes = Object.values(EmploymentType);

  designationsInSelectedOffice = computed(() => {
    const allDesigs = this.officesDesignations()
    const selectedOffice = this.selectedOffice()

    if(!selectedOffice) return []

    return allDesigs.filter(desig => desig.officeId === selectedOffice.id)
  })

  showOfficeLabelRatherThanId = (officeId: string) => {
    if (!officeId) return '';

    const office = this.offices().find((m) => m.id === officeId);
    return office?.name ?? '';
  };

  searchQuery = signal<string>('');
  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  emptyState = computed(() => {
    const list = this.staff();

    if (list.length === 0) {
      return this.staffRegistryFirstTime;
    }

    if (this.searchQuery() && list.length === 0) {
      return this.staffRegistryNoResults;
    }

    return this.staffRegistryNoResults;
  });

   filteredStaff = computed(() => {
    const allStaff = this.staff();
    const query = this.searchQuery().toLowerCase();

    return allStaff.filter(s => s.fullName.toLowerCase().includes(query));
  });

  staffPersonalInformationFormGroup = new FormGroup({
    firstName: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    lastName: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    middleName: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    email: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    phoneNum: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
  });

  professionalDetailsFormGroup = new FormGroup({
    internalOffice: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    designation: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    staffId: new FormControl<number>(0, { nonNullable: true, validators: Validators.required }),
  });

  numberOfStepsToCompleteNewStaffRecord = 2;
  currentStepInCompletingNewStaffRecord = signal<number>(1);

  @ViewChild('stepper')
  stepper!: MatStepper;
  proceedToNextStepToCompleteNewStaffRecord() {
    this.currentStepInCompletingNewStaffRecord.update((prev_value) => prev_value + 1);

    // move the stepper to the next step
    this.stepper.next();
  }

  revertToPreviousStepInCompletingNewStaffRecord() {
    this.currentStepInCompletingNewStaffRecord.update((prev_value) => prev_value - 1);

    // move the stepper to the next step
    this.stepper.previous();
  }

  isFinalStepInCompletingNewStaffRecord() {
    return (
      this.currentStepInCompletingNewStaffRecord() === this.numberOfStepsToCompleteNewStaffRecord
    );
  }

  selectedOffice = signal<any>(null);
  onOfficeSelection(selectedOffice: any) {
    this.selectedOffice.set(selectedOffice);
  }

  selectedOfficeDesignation = signal<any>(null);
  onOfficeDesignationSelection(selectedOfficeDesignation: any) {
    this.selectedOfficeDesignation.set(selectedOfficeDesignation);
  }

  selectedEmploymentType = signal<any>(null);
  onEmploymentTypeSelection(selectedEmploymentType: any) {
    this.selectedEmploymentType.set(selectedEmploymentType);
  }

  submitStaffData() {
    this.staffService.addNewStaff({
        firstName: this.staffPersonalInformationFormGroup.getRawValue().firstName,
        lastName: this.staffPersonalInformationFormGroup.getRawValue().lastName,
        middleName: this.staffPersonalInformationFormGroup.getRawValue().middleName,
        email: this.staffPersonalInformationFormGroup.getRawValue().email,
        phoneNumber: this.staffPersonalInformationFormGroup.getRawValue().phoneNum,
        staffNumber: this.professionalDetailsFormGroup.getRawValue().staffId,
        designationId: this.selectedOfficeDesignation().id,
        officeId: this.selectedOffice().id,
        createdBy: this.loggedInStaff.id,
        unitId: this.loggedInStaff.unit.id,
        employmentType: this.selectedEmploymentType()
    })
  }
}
