import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTriangleAlert } from '@ng-icons/lucide';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { AuthorityDecisionControl } from '../../components/authority-decision-control/authority-decision-control';
import { DecisionDetail } from '../../components/decision-detail/decision-detail';
import { LeadershipService } from '../../services/leadership/leadership-service';

@Component({
  selector: 'nexus-leadership-escalations',
  imports: [
    NgIcon,
    HlmBreadCrumbImports,
    HlmButtonImports,
    HlmCardImports,
    HlmSeparator,
    AuthorityDecisionControl,
    DecisionDetail,
  ],
  templateUrl: './escalations.html',
  providers: [provideIcons({ lucideTriangleAlert })],
})
export class Escalations {
  readonly leadership = inject(LeadershipService);
}
