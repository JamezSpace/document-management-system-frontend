import { AfterViewInit, Component, computed, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideXCircle } from '@ng-icons/lucide';
import { MatTooltip } from '@angular/material/tooltip';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import {
  HlmInputGroup,
  HlmInputGroupAddon,
  HlmInputGroupImports,
} from '@spartan-ng/helm/input-group';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { SideModal } from '../../../../../../components/dashboard-wide/shared/side-modal/side-modal';
import { SpartanH3 } from '../../../../../../components/system-wide/typography/spartan-h3/spartan-h3';
import { SpartanMuted } from '../../../../../../components/system-wide/typography/spartan-muted/spartan-muted';
import { SpartanP } from '../../../../../../components/system-wide/typography/spartan-p/spartan-p';
import { StaffWithMedia } from '../../../../../../interfaces/users/office/staff/StaffWithMedia.api';
import { SideModalService } from '../../../../../../services/page-wide/dashboard/generic/side-modal/side-modal-service';
import { StaffService } from '../../../../../../services/page-wide/dashboard/operations/hr/staff/staff-service';
import { UtilService } from '../../../../../../services/system-wide/util-service/util-service';

@Component({
  selector: 'nexus-staff-activation',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    HlmInputGroupImports,
    HlmInputGroup,
    HlmInputGroupAddon,
    HlmSeparator,
    HlmAlertDialogImports,
    NgIcon,
    MatTooltip,
    SideModal,
    SpartanH3,
    SpartanMuted,
    SpartanP,
  ],
  templateUrl: './staff-activation.html',
  styleUrl: './staff-activation.css',
  providers: [
    provideIcons({
      lucideSearch,
      lucideXCircle,
    }),
  ],
})
export class StaffActivation implements OnInit, AfterViewInit {
  private staffService = inject(StaffService);
  private sideModalService = inject(SideModalService);
  private utilService = inject(UtilService);

  staff = this.staffService.staff;
  selectedStaff = signal<StaffWithMedia | null>(null);

  searchQuery = signal<string>('');
  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  filteredStaff = computed(() => {
    const query = this.searchQuery().toLowerCase();

    return this.staff().filter((member) => member.fullName.toLowerCase().includes(query) && member.status === 'pending');
  });

  dataSource = new MatTableDataSource<StaffWithMedia>([]);
  columnsToDisplay: string[] = [
    'staffNumber',
    'fullName',
    'email',
    'unit',
    'designation',
    'status',
    'profilePicture',
    'signature',
  ];

  constructor() {
    effect(() => {
      this.dataSource.data = this.filteredStaff();
    });
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.staffService.fetchAllStaff();
  }

  openStaffDetails(staff: StaffWithMedia) {
    this.selectedStaff.set(staff);

    this.sideModalService.open();
  }

  closeStaffDetails() {
    this.sideModalService.close();
  }

  confirmActivation() {
    const staff = this.selectedStaff();
    if (!staff) return;

    this.staffService.activateStaff(staff.id);
  }

  canActivate(staff: StaffWithMedia) {
    return this.hasProfilePicture(staff) && this.hasSignature(staff);
  }

  getUnitLabel(staff: StaffWithMedia) {
    return staff.unit?.name ?? '--';
  }

  getDesignationTitle(staff: StaffWithMedia) {
    return staff.designation?.title ?? '--';
  }

  formatDate(date: string | null) {
    return this.utilService.formatDateAsReadableString(date);
  }

  private normalizeMedia(staff: StaffWithMedia) {
    const media: any = (staff as any).media;
    if (!media) return [];
    return Array.isArray(media) ? media : [media];
  }

  private findMediaByRole(staff: StaffWithMedia, keywords: string[]) {
    const mediaList = this.normalizeMedia(staff);
    return (
      mediaList.find((m: any) => {
        const role = (m?.assetRole ?? '').toLowerCase();
        return keywords.some((k) => role.includes(k));
      }) ?? null
    );
  }

  hasProfilePicture(staff: StaffWithMedia) {
    return !!this.findMediaByRole(staff, ['profile', 'passport', 'photo']);
  }

  hasSignature(staff: StaffWithMedia) {
    return !!this.findMediaByRole(staff, ['signature', 'sign']);
  }

  getProfilePictureUrl(staff: StaffWithMedia) {
    return this.findMediaByRole(staff, ['profile', 'passport', 'photo'])?.objectKey ?? '';
  }

  getSignatureUrl(staff: StaffWithMedia) {
    return this.findMediaByRole(staff, ['signature', 'sign'])?.objectKey ?? '';
  }
}
