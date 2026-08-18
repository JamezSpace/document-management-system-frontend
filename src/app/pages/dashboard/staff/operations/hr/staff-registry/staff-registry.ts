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
import type { EmptyStateConfig } from '../../../../../../models/ui/global/EmptyState.ui';
import { NotifStatus } from '../../../../../../models/ui/global/NotifStatus.ui';
import { InvitesListView } from '../../../../../../shared/components/dashboard-wide/operations/invites-list-view/invites-list-view';
import { StaffListView } from '../../../../../../shared/components/dashboard-wide/operations/staff-list-view/staff-list-view';
import { EmptyState } from '../../../../../../shared/components/empty-state/empty-state';
import { LineLoader } from '../../../../../../shared/components/loaders/line-loader/line-loader';
import { StatusModal } from '../../../../../../shared/components/status-modal/status-modal';
import { UtilService } from '../../../../../../shared/utils/service/util-service';
import { OrganizationService } from '../../../../../../features/shared/services/organization/organization-service';
import { officeActivityContext } from '../../../../../../office-platform/activity/office-activity.context';

@Component({
  selector: 'nexus-staff-registry',
  imports: [
    MatStepperModule,
    
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

  ngOnInit(): void {
    const currentPath = this.activatedRouter.snapshot.url.toString();

    this.directories.set(currentPath.split(','))

    // staff init deps
    this.staffService.fetchAllStaff(officeActivityContext());
    this.organizationService.fetchAllOffices(
      this.loggedInStaff.unit.id,
      officeActivityContext(),
    );
    this.organizationService.fetchAllDesignations(officeActivityContext());
    this.inviteService.fetchAllInvites(officeActivityContext());
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

  emptyState = computed<EmptyStateConfig>(() => {
    const invitesView = this.viewMode() === 'invites';
    const source = invitesView ? this.invites() : this.staff();
    const filtered = invitesView ? this.filteredInvites() : this.filteredStaff();

    if (source.length === 0) {
      return {
        kind: 'first-use',
        iconName: 'lucideUserPlus',
        title: invitesView ? 'No invitations have been sent' : 'Build your staff registry',
        description: invitesView
          ? 'Invitations awaiting onboarding will appear here with their current status.'
          : 'Register the first staff member to begin building this office’s controlled personnel record.',
        actions: [{ id: 'invite-staff', label: 'Invite staff member', appearance: 'primary' }],
      };
    }

    return {
      kind: 'no-results',
      iconName: 'lucideSearchX',
      title: `No ${invitesView ? 'invitations' : 'staff'} match “${this.searchQuery()}”`,
      description: filtered.length === 0
        ? 'Try a different search term or clear the search to restore the complete registry.'
        : 'No records are available in this view.',
      actions: [{ id: 'clear-search', label: 'Clear search', appearance: 'secondary' }],
    };
  });

  handleEmptyStateAction(action: string): void {
    if (action === 'invite-staff') this.inviteStaffDialog.open();
    if (action === 'clear-search') this.searchQuery.set('');
  }

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
