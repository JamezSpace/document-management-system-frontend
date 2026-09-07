import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideHistory, lucideSearch } from '@ng-icons/lucide';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { LeadershipService } from '../../services/leadership/leadership-service';

@Component({
  selector: 'nexus-decision-audit-trail',
  imports: [
    NgIcon,
    HlmBreadCrumbImports,
    HlmButtonImports,
    HlmInput,
    HlmSeparator,
    HlmTableImports,
  ],
  templateUrl: './decision-audit-trail.html',
  providers: [provideIcons({ lucideChevronRight, lucideHistory, lucideSearch })],
})
export class DecisionAuditTrail {
  readonly leadership = inject(LeadershipService);
}
