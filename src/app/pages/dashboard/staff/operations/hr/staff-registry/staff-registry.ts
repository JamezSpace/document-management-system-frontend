import { Component, computed, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    lucideArrowDownUp,
    lucideArrowLeft,
    lucideArrowRight,
    lucideHash,
    lucideMail,
    lucidePlus,
    lucideSearch,
    lucideUserPlus,
} from '@ng-icons/lucide';
import { BrnAlertDialogContent, BrnAlertDialogTrigger } from '@spartan-ng/brain/alert-dialog';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmAlertDialog, HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
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
import { CurrentStaffService } from '../../../../../../features/shared/services/current-staff/current-staff-service';
import { StaffService } from '../../../../../../core/services/page-wide/dashboard/operations/hr/staff/staff-service';
import { EmploymentType } from '../../../../../../enums/staff/employmentType.enum';
import { InviteService } from '../../../../../../features/onboarding/services/invite/invite-service';
import { DesignationApi } from '../../../../../../models/api/organization/designation.api';
import { OfficeApi } from '../../../../../../models/api/organization/offices.api';
import { EmptyStateInterface, EmptyStateType } from '../../../../../../models/ui/global/EmptyState.ui';
import { NotifStatus } from '../../../../../../models/ui/global/NotifStatus.ui';
import { InvitesListView } from '../../../../../../shared/components/dashboard-wide/operations/invites-list-view/invites-list-view';
import { StaffListView } from '../../../../../../shared/components/dashboard-wide/operations/staff-list-view/staff-list-view';
import { EmptyState } from '../../../../../../shared/components/empty-state/empty-state';
import { LineLoader } from '../../../../../../shared/components/loaders/line-loader/line-loader';
import { StatusModal } from '../../../../../../shared/components/status-modal/status-modal';
import { SpartanH3 } from '../../../../../../shared/typography/spartan-h3/spartan-h3';
import { SpartanH4 } from '../../../../../../shared/typography/spartan-h4/spartan-h4';
import { SpartanMuted } from '../../../../../../shared/typography/spartan-muted/spartan-muted';
import { SpartanP } from '../../../../../../shared/typography/spartan-p/spartan-p';
import { UtilService } from '../../../../../../shared/utils/service/util-service';
import { OrganizationService } from '../../../../../../features/shared/services/organization/organization-service';

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
    StaffListView,
    LineLoader,
    StatusModal,
    InvitesListView,
  ],
  templateUrl: './staff-registry.html',
  styleUrl: './staff-registry.css',
  providers: [
    provideIcons({
      lucidePlus,
      lucideUserPlus,
      lucideSearch,
      lucideArrowDownUp,
      lucideHash,
      lucideArrowRight,
      lucideArrowLeft,
      lucideMail,
    }),
  ],
})
export class StaffRegistry implements OnInit {
  private utilService = inject(UtilService);
  staffService = inject(StaffService);
  organizationService = inject(OrganizationService);
  inviteService = inject(InviteService);
  currentStaffService = inject(CurrentStaffService);
  activatedRouter = inject(ActivatedRoute);

  private queryParams = toSignal(this.activatedRouter.queryParamMap);
  viewMode = computed(() => this.queryParams()?.get('view'));

  readonly loggedInStaff = this.currentStaffService.data()!;

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
    const currentPath = this.activatedRouter.snapshot.url.toString();

    this.directories.set(currentPath.split(','))

    // staff init deps
    this.staffService.fetchAllStaff();
    this.organizationService.fetchAllOffices(this.loggedInStaff.unit.id);
    this.organizationService.fetchAllDesignations();
    this.inviteService.fetchAllInvites();    
  }

  staff = this.staffService.staff;
  invites = this.inviteService.invites;
  offices = this.staffService.officesInUnit;
  officesDesignations = this.staffService.officesDesignations;
  employmentTypes = Object.values(EmploymentType);
  staffServiceLoading = this.staffService.loading;
  inviteServiceLoading = this.inviteService.loading;

  designationsInSelectedOffice = computed(() => {
    const allDesigs = this.officesDesignations();
    const selectedOffice = this.selectedOffice();

    if (!selectedOffice) return [];

    return allDesigs.filter((desig) => desig.officeId === selectedOffice.id);
  });

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
    const list = this.viewMode() === 'invites' ? this.invites() : this.staff()

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

    return allStaff.filter((s) => s.fullName.toLowerCase().includes(query));
  });

  filteredInvites = computed(() => {
    const allInvites = this.invites();
    const query = this.searchQuery().toLowerCase();

    return allInvites.filter((invite) => invite.email.toLowerCase().includes(query));
  });

  inviteEmailFormGroup = new FormGroup({
    email: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
  });

  officeFormGroup = new FormGroup({
    office: new FormControl<OfficeApi>(
      {
        id: '',
        name: '',
        unitId: '',
        createdAt: new Date(0),
      },
      { nonNullable: true, validators: Validators.required },
    ),
    designation: new FormControl<DesignationApi>(
      {
        value: {
          id: '',
          officeId: '',
          title: '',
        },
        disabled: true,
      },
      { validators: Validators.required },
    ),
  });

  employmentTypeFormGroup = new FormGroup({
    employmentType: new FormControl<EmploymentType>(EmploymentType.PERMANENT, {
      nonNullable: true,
      validators: Validators.required,
    }),
  });

  numberOfStepsToCompleteNewStaffRecord = 4;
  currentStepInCompletingNewStaffRecord = signal<number>(1);

  @ViewChild('stepper')
  stepper!: MatStepper;

  @ViewChild('inviteStaffDialog')
  inviteStaffDialog!: HlmAlertDialog;

  @ViewChild('inviteSentStatusModal')
  inviteSentStatusModal!: StatusModal;

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

    this.officeFormGroup.controls.office.setValue(selectedOffice);

    this.officeFormGroup.controls.designation.enable();
  }

  selectedOfficeDesignation = signal<any>(null);
  onOfficeDesignationSelection(selectedOfficeDesignation: any) {
    this.selectedOfficeDesignation.set(selectedOfficeDesignation);
    this.officeFormGroup.controls.designation.setValue(selectedOfficeDesignation);
  }

  selectedEmploymentType = signal<any>(null);
  onEmploymentTypeSelection(selectedEmploymentType: any) {
    this.selectedEmploymentType.set(selectedEmploymentType);
  }

  pendingInviteEmail = signal<string>('');
  inviteSentStatusNotification = signal<NotifStatus>({
    iconName: 'lucideMail',
    title: 'Invitation Sent',
    description: 'The onboarding invite has been sent successfully.',
  });

  sendInvite() {
    const inviteEmail = this.inviteEmailFormGroup.getRawValue().email;
    this.pendingInviteEmail.set(inviteEmail);

    this.inviteService.initInvite({
      email: inviteEmail,
      createdBy: this.loggedInStaff.id,
      officeId: this.officeFormGroup.getRawValue().office.id,
      designationId: this.officeFormGroup.getRawValue().designation!.id,
      employmentType: this.employmentTypeFormGroup.getRawValue().employmentType,
      unitId: this.loggedInStaff.unit.id,
    });
  }

  inviteSentSuccess = effect(() => {
    const inviteSent = this.inviteService.inviteSent();

    if (!inviteSent) return;

    const invitedEmail = this.pendingInviteEmail();
    this.inviteSentStatusNotification.set({
      iconName: 'lucideMail',
      title: 'Invite Sent',
      description: invitedEmail
        ? `An onboarding invite has been sent to ${invitedEmail}.`
        : 'An onboarding invite has been sent successfully.',
    });

    this.inviteStaffDialog?.close();
    this.inviteSentStatusModal?.open();

    this.inviteService.inviteSent.set(false);
  });

  submitStaffData() {
    // this.staffService.addNewStaff({
    //     firstName: this.staffPersonalInformationFormGroup.getRawValue().firstName,
    //     lastName: this.staffPersonalInformationFormGroup.getRawValue().lastName,
    //     middleName: this.staffPersonalInformationFormGroup.getRawValue().middleName,
    //     email: this.staffPersonalInformationFormGroup.getRawValue().email,
    //     phoneNumber: this.staffPersonalInformationFormGroup.getRawValue().phoneNum,
    //     staffNumber: this.professionalDetailsFormGroup.getRawValue().staffId,
    //     designationId: this.selectedOfficeDesignation().id,
    //     officeId: this.selectedOffice().id,
    //     createdBy: this.loggedInStaff.id,
    //     unitId: this.loggedInStaff.unit.id,
    //     employmentType: this.selectedEmploymentType()
    // })
  }
}
