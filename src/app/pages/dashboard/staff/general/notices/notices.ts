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

@Component({
  selector: 'nexus-notices',
  imports: [
    HlmSeparator,
    HlmMenubarImports,
    HlmDropdownMenuImports,
    HlmInputGroupImports,
    HlmTooltipImports,
    NgIcon
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

  directories = signal<string[]>([]);
  ngOnInit(): void {
    const currentPath = this.activatedRouter.snapshot.url.toString();

    this.directories.set(currentPath.split(','));
  }

  private afterInitEffect = effect(() => {
    const staff = this.signedInStaff();
    if (!staff) return;

    // fetch deps
    if (!this.noticeService.notices()) this.noticeService.fetchNotices(staff.id);
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
      notifications[key] = [];
      notifications[key].push(notif);
    });

    console.log(notifications);    
    return notifications;
  });

  sortedNotificationsEntries = computed(() => Object.entries(this.sortedNotifications()));
}
