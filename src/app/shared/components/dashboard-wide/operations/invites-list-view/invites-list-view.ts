import { Component, effect, inject, input, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMoreVertical, lucideXCircle } from '@ng-icons/lucide';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmMenubarImports } from '@spartan-ng/helm/menubar';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSeparator } from "@spartan-ng/helm/separator";
import { SideModalService } from '../../../../../core/services/page-wide/dashboard/generic/side-modal/side-modal-service';
import { StaffService } from '../../../../../core/services/page-wide/dashboard/operations/hr/staff/staff-service';
import { EmploymentType } from '../../../../../enums/staff/employmentType.enum';
import { InviteService } from '../../../../../features/onboarding/services/invite/invite-service';
import { InviteApi } from '../../../../../models/api/staff/Invite.api';
import { SpartanH4 } from '../../../../typography/spartan-h4/spartan-h4';
import { SpartanMuted } from '../../../../typography/spartan-muted/spartan-muted';
import { SpartanP } from '../../../../typography/spartan-p/spartan-p';
import { UtilService } from '../../../../utils/service/util-service';
import { SideModal } from '../../../side-modal/side-modal';
import { CurrentStaffService } from '../../../../../features/shared/services/current-staff/current-staff-service';
import { OrganizationService } from '../../../../../features/shared/services/organization/organization-service';

@Component({
  selector: 'nexus-invites-list-view',
  imports: [
    SideModal,
    SpartanH4,
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    HlmAlertDialogImports,
    HlmDropdownMenuImports,
    HlmMenubarImports,
    HlmInputImports,
    BrnSelectImports,
    HlmSelectImports,
    NgIcon,
    SpartanMuted,
    SpartanP,
    HlmSeparator
],
  templateUrl: './invites-list-view.html',
  styleUrl: './invites-list-view.css',
  providers: [
    provideIcons({
      lucideMoreVertical,
      lucideXCircle
    }),
  ],
})
export class InvitesListView {
  private sideModalService = inject(SideModalService);
  private utilService = inject(UtilService);
  private organizationService = inject(OrganizationService);
  inviteService = inject(InviteService);
  currentStaffService = inject(CurrentStaffService);

  offices = this.organizationService.officesInUnit;
  designations = this.organizationService.officesDesignations;
  employmentTypes = Object.values(EmploymentType);

  editMode = signal<boolean>(false);
  loading = this.inviteService.loading;
  invites = input.required<InviteApi[]>();
  selectedInvite = signal<InviteApi | null>(null);

  dataSource = new MatTableDataSource<InviteApi>([]);
  columnsToDisplay: string[] = [
    'email',
    'unit',
    'office',
    'designation',
    'employmentType',
    'invitedBy',
    'status',
    'actions',
  ];

  constructor() {
    effect(() => {
      this.dataSource.data = this.invites();
    });
  }

  ngOnInit(): void {
    const actor = this.currentStaffService.data()

    if(!actor) return

    if (!this.organizationService.officesInUnit) 
      this.organizationService.fetchAllOffices(actor.unit.id);
    if (!this.organizationService.officesDesignations) 
      this.organizationService.fetchAllDesignations();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  inviteUpdateForm = new FormGroup({
    officeId: new FormControl('', Validators.required),
    designationId: new FormControl('', Validators.required),
    employmentType: new FormControl('', Validators.required),
  });

  getUnitLabel = this.inviteService.getUnitLabel;
  getOfficeLabel = this.inviteService.getOfficeLabel;
  getDesignationTitle = this.inviteService.getDesignationTitle;

  setActionTarget(invite: InviteApi) {
    this.selectedInvite.set(invite);
  }

  openUpdateModal() {
    const invite = this.selectedInvite();
    if (!invite) return;

    this.editMode.set(true);
    this.inviteUpdateForm.patchValue({
      officeId: invite.office?.id ?? '',
      designationId: invite.designation?.id ?? '',
      employmentType: invite.employmentType ?? '',
    });

    this.sideModalService.open();
  }

  openInviteDetails(invite: InviteApi) {
    this.selectedInvite.set(invite);
    this.editMode.set(false);
    this.sideModalService.open();
  }

  closeInviteDetails() {
    this.sideModalService.close();
  }

  formatDate(date: string | null) {
      const resultantDate = this.utilService.formatDateAsReadableString(date);

      return resultantDate.length === 0 ? '--' : resultantDate;
  }

  saveInviteUpdates() {
    const invite = this.selectedInvite();
    if (!invite || this.inviteUpdateForm.invalid) return;

    // const payload = {
    //   officeId: this.inviteUpdateForm.value.officeId!,
    //   designationId: this.inviteUpdateForm.value.designationId!,
    //   employmentType: this.inviteUpdateForm.value.employmentType!,
    //   inviteNumber: this.inviteUpdateForm.value.inviteNumber!,
    // };

    // this.inviteService.updateInvite(invite.id, payload);
  }

  nudgeInvite() {
    const invite = this.selectedInvite();
    if (!invite) return;

    this.inviteService.nudgeInvite(invite.id);
  }

  deleteSelectedInvite() {
    const invite = this.selectedInvite();
    if (!invite) return;

    this.inviteService.deleteInvite(invite.id);
  }
}
