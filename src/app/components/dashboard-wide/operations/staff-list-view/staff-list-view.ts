import { AfterViewInit, Component, effect, inject, input, OnInit, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMoreVertical, lucideXCircle } from '@ng-icons/lucide';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmMenubarImports } from '@spartan-ng/helm/menubar';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { BaseStaffEntity } from '../../../../interfaces/users/office/staff/BaseStaff.api';
import { SideModal } from '../../shared/side-modal/side-modal';
import { SideModalService } from '../../../../services/page-wide/dashboard/generic/side-modal/side-modal-service';
import { UtilService } from '../../../../services/system-wide/util-service/util-service';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { SpartanH4 } from '../../../system-wide/typography/spartan-h4/spartan-h4';
import { SpartanMuted } from '../../../system-wide/typography/spartan-muted/spartan-muted';
import { SpartanP } from '../../../system-wide/typography/spartan-p/spartan-p';
import { StaffService } from '../../../../services/page-wide/dashboard/operations/hr/staff/staff-service';

@Component({
  selector: 'nexus-staff-list-view',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    HlmAlertDialogImports,
    HlmDropdownMenuImports,
    HlmMenubarImports,
    HlmInputImports,
    HlmLabelImports,
    BrnSelectImports,
    HlmSelectImports,
    SideModal,
    NgIcon,
    HlmSeparator,
    SpartanH4,
    SpartanMuted,
    SpartanP,
  ],
  templateUrl: './staff-list-view.html',
  styleUrl: './staff-list-view.css',
  providers: [provideIcons({ lucideMoreVertical, lucideXCircle })],
})
export class StaffListView implements OnInit, AfterViewInit {
  private sideModalService = inject(SideModalService);
  private utilService = inject(UtilService);
  private staffService = inject(StaffService);

  staff = input.required<BaseStaffEntity[]>();
  selectedStaff = signal<BaseStaffEntity | null>(null);
  editMode = signal<boolean>(false);

  dataSource = new MatTableDataSource<BaseStaffEntity>([]);
  columnsToDisplay: string[] = [
    'staffNumber',
    'fullName',
    'email',
    'unit',
    'designation',
    'status',
    'actions',
  ];

  constructor() {
    effect(() => {
      this.dataSource.data = this.staff();
    });
  }

  ngOnInit(): void {
    this.staffService.fetchAllOffices();
    this.staffService.fetchAllDesignations();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  staffUpdateForm = new FormGroup({
    officeId: new FormControl('', Validators.required),
    designationId: new FormControl('', Validators.required),
    employmentType: new FormControl('', Validators.required),
    staffNumber: new FormControl('', Validators.required),
  });

  offices = this.staffService.officesInUnit;
  designations = this.staffService.officeDesignations;
  employmentTypes = ['full-time', 'part-time', 'contract'];

  setActionTarget(staff: BaseStaffEntity) {
    this.selectedStaff.set(staff);
  }

  openStaffDetails(staff: BaseStaffEntity) {
    this.selectedStaff.set(staff);
    this.editMode.set(false);
    this.sideModalService.open();
  }

  openUpdateModal() {
    const staff = this.selectedStaff();
    if (!staff) return;

    this.editMode.set(true);
    this.staffUpdateForm.patchValue({
      officeId: staff.office?.id ?? '',
      designationId: staff.designation?.id ?? '',
      employmentType: staff.employmentType ?? '',
      staffNumber: staff.staffNumber?.toString() ?? '',
    });

    this.sideModalService.open();
  }

  closeStaffDetails() {
    this.sideModalService.close();
  }

  canEdit(staff: BaseStaffEntity) {
    const status = staff.status?.toLowerCase();
    return status === 'pending' || status === 'active';
  }

  saveStaffUpdates() {
    const staff = this.selectedStaff();
    if (!staff || this.staffUpdateForm.invalid) return;

    const payload = {
      officeId: this.staffUpdateForm.value.officeId!,
      designationId: this.staffUpdateForm.value.designationId!,
      employmentType: this.staffUpdateForm.value.employmentType!,
      staffNumber: this.staffUpdateForm.value.staffNumber!,
    };

    this.staffService.updateStaff(staff.id, payload);
  }

  deleteSelectedStaff() {
    const staff = this.selectedStaff();
    if (!staff) return;

    this.staffService.deleteStaff(staff.id);
  }

  getUnitLabel(staff: BaseStaffEntity) {
    return staff.unit?.name ?? '--';
  }

  getDesignationTitle(staff: BaseStaffEntity) {
    return staff.designation?.title ?? '--';
  }

  formatDate(date: string | null) {
    return this.utilService.formatDateAsReadableString(date);
  }
}
