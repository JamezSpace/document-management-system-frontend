import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { provideIcons, NgIcon } from '@ng-icons/core';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmMenubarImports } from '@spartan-ng/helm/menubar';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { hugeTickDouble02 } from '@ng-icons/huge-icons';
import { NoticesService } from '../../../../../core/services/page-wide/dashboard/generic/notices/notices-service';
import { NotificationPreference } from '../../../../../enums/notices/notices.enum';
import { CurrentStaffService } from '../../../../../features/shared/services/current-staff/current-staff-service';
import { NoticesApi } from '../../../../../models/api/notices/notices.api';
import type { EmptyStateConfig } from '../../../../../models/ui/global/EmptyState.ui';
import { EmptyState } from '../../../../../shared/components/empty-state/empty-state';
import { officeActivityContext } from '../../../../../office-platform/activity/office-activity.context';

@Component({
  selector: 'nexus-notices',
  imports: [
    HlmSeparator,
    HlmMenubarImports,
    HlmDropdownMenuImports,
    HlmInputGroupImports,
    HlmTooltipImports,
    NgIcon,
    EmptyState,
],
  templateUrl: './notices.html',
  styleUrl: './notices.css',
  providers: [provideIcons({
    hugeTickDouble02
  })],
})
export class Notices {
  private activatedRouter = inject(ActivatedRoute);
  noticeService = inject(NoticesService);
  currentStaffService = inject(CurrentStaffService);

  readonly signedInStaff = this.currentStaffService.data;
  readonly emptyState: EmptyStateConfig = {
    kind: 'no-data',
    iconName: 'lucideBell',
    title: 'You are all caught up',
    description:
      'Official document updates, administrative notices, and system announcements will appear here when they arrive.',
    actions: [{ id: 'refresh-notices', label: 'Check again', appearance: 'secondary' }],
  };
  private noticesRequested = false;

  directories = signal<string[]>([]);
  ngOnInit(): void {
    const currentPath = this.activatedRouter.snapshot.url.toString();

    this.directories.set(currentPath.split(','));
  }

  private afterInitEffect = effect(() => {
    const staff = this.signedInStaff();
    if (!staff) return;

    if (!this.noticesRequested) {
      this.noticesRequested = true;
      this.noticeService.fetchNotices(staff.id, officeActivityContext());
    }
  });

  isSameDate(dateString: string, compareDate: Date) {
    return (
      dateString ===
      new Date(compareDate).toLocaleDateString('en-US', {
        dateStyle: 'medium',
      })
    );
  }

  sortedNotifications = computed(() => {
    const incomingNotifications = this.noticeService.notices().filter(n => n.channel === NotificationPreference.IN_APP);

    let notifications: Record<string, NoticesApi[]> = {};

    let key = '';
    incomingNotifications.forEach((notif) => {
      if (!this.isSameDate(key, notif.createdAt))
        key = new Date(notif.createdAt).toLocaleDateString('en-US', {
          dateStyle: 'medium',
        });

        // initialize a new record with an empty array before populating with the actual data
      if (!notifications[key]) notifications[key] = [];
      notifications[key].push(notif);
    });

    return notifications;
  });

  sortedNotificationsEntries = computed(() => Object.entries(this.sortedNotifications()));

  handleEmptyStateAction(action: string): void {
    const staff = this.signedInStaff();
    if (action === 'refresh-notices' && staff) {
      this.noticeService.fetchNotices(staff.id, officeActivityContext());
    }
  }
}
