import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendarClock, lucideChevronRight, lucideCircleAlert, lucideInbox, lucideLockKeyhole, lucideScanLine } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { RecordsPageShell } from '../../components/records-page-shell/records-page-shell';

@Component({
  selector: 'nexus-records-overview',
  imports: [NgIcon, RouterLink, HlmButtonImports, HlmCardImports, RecordsPageShell],
  templateUrl: './records-overview.html',
  providers: [provideIcons({ lucideCalendarClock, lucideChevronRight, lucideCircleAlert, lucideInbox, lucideLockKeyhole, lucideScanLine })],
})
class RecordsOverview {}

export { RecordsOverview };
