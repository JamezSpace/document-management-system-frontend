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
import { EmploymentType } from '../../../../enum/staff/employmentType.enum';
import { InviteApi } from '../../../../interfaces/staff/Invite.api';
import { SideModalService } from '../../../../services/page-wide/dashboard/generic/side-modal/side-modal-service';
import { StaffService } from '../../../../services/page-wide/dashboard/operations/hr/staff/staff-service';
import { InviteService } from '../../../../services/page-wide/onboarding/invite/invite-service';
import { UtilService } from '../../../../services/system-wide/util-service/util-service';
import { SpartanH4 } from '../../../system-wide/typography/spartan-h4/spartan-h4';
import { SpartanMuted } from '../../../system-wide/typography/spartan-muted/spartan-muted';
import { SpartanP } from '../../../system-wide/typography/spartan-p/spartan-p';
import { SideModal } from '../../shared/side-modal/side-modal';

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
  private staffService = inject(StaffService);
  private inviteService = inject(InviteService);

  offices = this.staffService.officesInUnit;
  designations = this.staffService.officeDesignations;
  employmentTypes = Object.values(EmploymentType);

  invites = input.required<InviteApi[]>();
  selectedInvite = signal<InviteApi | null>(null);
  editMode = signal<boolean>(false);

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
    if (!this.staffService.officesInUnit) this.staffService.fetchAllOffices();
    if (!this.staffService.officeDesignations) this.staffService.fetchAllDesignations();
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
