import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideAlarmClock, lucideAward, lucideBriefcaseBusiness, lucideCalendarCheck, lucideCheck, lucideShieldCheck, lucideUserCheck, lucideUsers } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';

@Component({
  selector: 'nexus-hr-overview',
  imports: [NgIcon, RouterLink, HlmButtonImports, HlmCardImports, HlmSeparator, HlmSheetImports],
  templateUrl: './hr-overview.html',
  providers: [provideIcons({ lucideAlarmClock, lucideAward, lucideBriefcaseBusiness, lucideCalendarCheck, lucideCheck, lucideShieldCheck, lucideUserCheck, lucideUsers })],
})
class HrOverview {}

export { HrOverview };
