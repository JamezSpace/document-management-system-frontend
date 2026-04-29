import {
  AfterViewInit,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideXCircle } from '@ng-icons/lucide';
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
import { StaffWithMedia } from '../../../../../../interfaces/staff/StaffWithMedia.api';
import { SideModalService } from '../../../../../../services/page-wide/dashboard/generic/side-modal/side-modal-service';
import { StaffService } from '../../../../../../services/page-wide/dashboard/operations/hr/staff/staff-service';
import { InviteService } from '../../../../../../services/page-wide/onboarding/invite/invite-service';
import { UtilService } from '../../../../../../services/system-wide/util-service/util-service';
import { OnboardingService } from '../../../../../../services/page-wide/onboarding/session/onboarding-service';
import { StaffToActivate } from '../../../../../../interfaces/staff/StaffToActivate.api';

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
  private onboardingSessionService = inject(OnboardingService);
  private sideModalService = inject(SideModalService);
  private utilService = inject(UtilService);
  activatedRouter = inject(ActivatedRoute);

  selectedStaff = signal<StaffToActivate | null>(null);

  searchQuery = signal<string>('');
  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  dataSource = new MatTableDataSource<StaffToActivate>([]);
  columnsToDisplay: string[] = ['staffNumber', 'fullName', 'email', 'profilePicture', 'signature', 'createdAt'];

  constructor() {
    effect(() => {
      this.dataSource.data = this.onboardingSessions();
    });
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  directories = signal<string[]>([]);
  ngOnInit(): void {
    const currentPath = this.activatedRouter.snapshot.url.toString();

    this.directories.update((prev_directories) => [...prev_directories, currentPath]);

    this.onboardingSessionService.fetchAllCompleteOnboardingSessions();
  }

  onboardingSessions = computed(() => {
    const allOnboardingSessions = this.onboardingSessionService.onboardingSessions();

    return allOnboardingSessions.map((session) => {
      const primary_data: {
        email: string;
        staffId: number;
        lastName: string;
        firstName: string;
        middleName: string;
      } = session.primaryData as any;

      return {
        staffNumber: primary_data.staffId,
        fullName: new String().concat(
          primary_data.lastName,
          ' ',
          primary_data.firstName,
          ' ',
          primary_data.middleName,
        ),
        email: primary_data.email,
        profilePicture: session.profilePictureUrl,
        signature: session.signatureUrl,
        createdAt: session.startedAt,
        completedAt: session.completedAt
      };
    });
  });

  openStaffDetails(invite: StaffToActivate) {
    this.selectedStaff.set(invite);

    this.sideModalService.open();
  }

  closeStaffDetails() {
    this.sideModalService.close();
  }

  confirmActivation() {
    const staff = this.selectedStaff();
    if (!staff) return;

    // this.staffService.activateStaff(staff.id);
  }

  canActivate(inviteSession: StaffToActivate) {
    return this.hasProfilePicture(inviteSession) && this.hasSignature(inviteSession);
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

  hasProfilePicture(inviteSession: StaffToActivate) {
    return inviteSession.profilePicture ? true : false;
  }

  hasSignature(inviteSession: StaffToActivate) {
    return inviteSession.signature ? true : false;
  }

  getProfilePictureUrl(invite: StaffToActivate) {
    // replace with actual method to get image url in the service
    return "https://placehold.co/600x400?text=Hello+World";
  }

  getSignatureUrl(invite: StaffToActivate) {
    // replace with actual method to get image url in the service
    return "25";
  }
}
