import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { provideIcons, NgIcon } from '@ng-icons/core';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmMenubarImports } from '@spartan-ng/helm/menubar';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { SpartanH3 } from '../../../../../components/system-wide/typography/spartan-h3/spartan-h3';
import { SpartanP } from '../../../../../components/system-wide/typography/spartan-p/spartan-p';
import { NoticesService } from '../../../../../services/page-wide/dashboard/generic/notices/notices-service';
import { StaffDetailsService } from '../../../../../services/page-wide/dashboard/office-template/staff-details-service';
import { SpartanMuted } from '../../../../../components/system-wide/typography/spartan-muted/spartan-muted';
import { NoticesApi } from '../../../../../interfaces/api/notices/notices.api';
import { NotificationPreference } from '../../../../../enum/notices/notices.enum';
import { hugeTickDouble02 } from '@ng-icons/huge-icons';

@Component({
  selector: 'nexus-notices',
  imports: [
    SpartanH3,
    SpartanP,
    HlmSeparator,
    HlmMenubarImports,
    HlmDropdownMenuImports,
    HlmInputGroupImports,
    HlmTooltipImports,
    SpartanMuted,
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
  staffDetailsService = inject(StaffDetailsService);

  readonly signedInStaff = this.staffDetailsService.data;

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
