import { Component, computed, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowDownUp,
  lucideHash,
  lucidePlus,
  lucideSearch,
  lucideArrowRight,
  lucideArrowLeft,
  lucideMail,
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
import { StaffListView } from '../../../../../../components/dashboard-wide/operations/staff-list-view/staff-list-view';
import { EmptyState } from '../../../../../../components/system-wide/empty-state/empty-state';
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
import { OfficeApi } from '../../../../../../interfaces/org units/offices.api';
import { DesignationApi } from '../../../../../../interfaces/org units/designation.api';
import { LineLoader } from '../../../../../../components/system-wide/loaders/line-loader/line-loader';
import { StatusModal } from '../../../../../../components/dashboard-wide/shared/status-modal/status-modal';
import { NotifStatus } from '../../../../../../interfaces/system/NotifStatus.ui';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { InviteService } from '../../../../../../services/page-wide/dashboard/operations/hr/staff/invite-service';
import { InvitesListView } from "../../../../../../components/dashboard-wide/operations/invites-list-view/invites-list-view";

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
    InvitesListView
],
  templateUrl: './staff-registry.html',
  styleUrl: './staff-registry.css',
  providers: [
    provideIcons({
      lucidePlus,
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
  private staffService = inject(StaffService);
  private inviteService = inject(InviteService);
  private staffDetService = inject(StaffDetailsService);
  private activatedRouter = inject(ActivatedRoute);

  private queryParams = toSignal(this.activatedRouter.queryParamMap);
    viewMode = computed(() => this.queryParams()?.get('view'));

  readonly loggedInStaff = this.staffDetService.data()!;

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
    this.inviteService.fetchAllInvites()
  }

  staff = this.staffService.staff;
  invites = this.inviteService.invites;
  offices = this.staffService.officesInUnit;
  officesDesignations = this.staffService.officeDesignations;
  employmentTypes = Object.values(EmploymentType);
  loading = this.staffService.loading;

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
            hierarchyLevel: 0,
            officeId: '',
            title: ''
        },
        disabled: true
      },
      { validators: Validators.required },
    ),
  });

  employmentTypeFormGroup = new FormGroup({
    employmentType: new FormControl<EmploymentType>(EmploymentType.PERMANENT, {nonNullable: true, validators: Validators.required})
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
        unitId: this.loggedInStaff.unit.id
    })
  }

  inviteSentSuccess = effect(() => {
    const inviteSent = this.inviteService.inviteSent()

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
  })

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
