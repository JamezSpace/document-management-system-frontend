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
import { ActivatedRoute } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideXCircle } from '@ng-icons/lucide';
import { BrnAlertDialogContent, BrnAlertDialogTrigger } from '@spartan-ng/brain/alert-dialog';
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
import { StaffToActivate } from '../../../../../../interfaces/staff/StaffToActivate.api';
import { SideModalService } from '../../../../../../services/page-wide/dashboard/generic/side-modal/side-modal-service';
import { StaffService } from '../../../../../../services/page-wide/dashboard/operations/hr/staff/staff-service';
import { OnboardingService } from '../../../../../../services/page-wide/onboarding/session/onboarding-service';
import { UtilService } from '../../../../../../services/system-wide/util-service/util-service';
import { HlmSpinner } from "@spartan-ng/helm/spinner";

@Component({
  selector: 'nexus-staff-activation',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    HlmInputGroupImports,
    HlmAlertDialogImports,
    BrnAlertDialogContent,
    BrnAlertDialogTrigger,
    HlmInputGroup,
    HlmInputGroupAddon,
    HlmSeparator,
    NgIcon,
    SideModal,
    SpartanH3,
    SpartanMuted,
    SpartanP,
    HlmSpinner
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
  private staffService = inject(StaffService);
  private utilService = inject(UtilService);
  activatedRouter = inject(ActivatedRoute);

  selectedStaff = signal<StaffToActivate | null>(null);
  loading = this.staffService.loading;

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

    this.directories.set(currentPath.split(','))

    this.onboardingSessionService.fetchAllCompleteOnboardingSessions();
    this.staffService.fetchAllUsers();
  }

  onboardingSessions = computed(() => {
    const allOnboardingSessions = this.onboardingSessionService.onboardingSessions();
    const allUsers = this.staffService.users();
    const normalizeEmail = (email: string | undefined | null) =>
      email?.trim().toLowerCase();
    const userEmails = new Set(
      allUsers
        .map((user) => normalizeEmail(user.email))
        .filter((email): email is string => !!email),
    );

    return allOnboardingSessions
      .filter((session) => {
        const primaryData: {
          email: string;
          staffId: number;
          lastName: string;
          firstName: string;
          middleName: string;
        } = session.primaryData as any;

        return !userEmails.has(normalizeEmail(primaryData.email) ?? '');
      })
      .map((session) => {
        const primaryData: {
          email: string;
          staffId: number;
          lastName: string;
          firstName: string;
          middleName: string;
        } = session.primaryData as any;

        return {
          inviteId: session.inviteId,
          staffNumber: primaryData.staffId,
          fullName: new String().concat(
            primaryData.lastName,
            ' ',
            primaryData.firstName,
            ' ',
            primaryData.middleName,
          ),
          email: primaryData.email,
          profilePicture: session.profilePicPublicURL,
          signature: session.signaturePublicURL,
          createdAt: session.startedAt,
          completedAt: session.completedAt,
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

  isInviteMigratedToNewStaff = this.staffService.isInviteMigratedToNewStaff;
  confirmActivation() {
    const staff = this.selectedStaff();
    if (!staff) return;

    this.staffService.migrateInviteToNewStaff(staff.inviteId);
  }

  canActivate(inviteSession: StaffToActivate) {
    return this.hasProfilePicture(inviteSession) && this.hasSignature(inviteSession);
  }

  formatDate(date: Date | string | null) {
    return this.utilService.formatDateAsReadableString(date);
  }

  hasProfilePicture(inviteSession: StaffToActivate) {
    return inviteSession.profilePicture ? true : false;
  }

  hasSignature(inviteSession: StaffToActivate) {
    return inviteSession.signature ? true : false;
  }
}
