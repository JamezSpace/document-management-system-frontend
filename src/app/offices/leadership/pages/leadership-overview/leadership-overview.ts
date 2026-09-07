import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideAlarmClock,
  lucideBadgeCheck,
  lucideGavel,
  lucidePenTool,
  lucideTriangleAlert,
  lucideZap,
} from '@ng-icons/lucide';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { AuthorityDecisionControl } from '../../components/authority-decision-control/authority-decision-control';
import { DecisionDetail } from '../../components/decision-detail/decision-detail';
import { LeadershipService } from '../../services/leadership/leadership-service';

@Component({
  selector: 'nexus-leadership-overview',
  imports: [
    NgIcon,
    RouterLink,
    HlmBreadCrumbImports,
    HlmButtonImports,
    HlmCardImports,
    HlmSeparator,
    AuthorityDecisionControl,
    DecisionDetail,
  ],
  templateUrl: './leadership-overview.html',
  providers: [
    provideIcons({
      lucideAlarmClock,
      lucideBadgeCheck,
      lucideGavel,
      lucidePenTool,
      lucideTriangleAlert,
      lucideZap,
    }),
  ],
})
export class LeadershipOverview {
  readonly leadership = inject(LeadershipService);
}
