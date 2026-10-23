import { Component, inject, OnInit } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucidePenTool, lucideShieldCheck } from '@ng-icons/lucide';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { OfficeContextService } from '../../../../office-platform/context/office-context.service';
import { AuthorityDecisionControl } from '../../components/authority-decision-control/authority-decision-control';
import { LeadershipService } from '../../services/leadership/leadership-service';

@Component({
  selector: 'nexus-signature-queue',
  imports: [
    NgIcon,
    HlmBreadCrumbImports,
    HlmCardImports,
    HlmSeparator,
    AuthorityDecisionControl,
  ],
  templateUrl: './signature-queue.html',
  providers: [provideIcons({ lucideCheck, lucidePenTool, lucideShieldCheck })],
})
class SignatureQueue implements OnInit {
  readonly officeContext = inject(OfficeContextService);
  readonly leadership = inject(LeadershipService);
  readonly selectedDecision = this.leadership.selectedDecision;

  ngOnInit(): void {
    const firstSignature = this.leadership.signatureDecisions[0];
    if (firstSignature) this.leadership.selectDecision(firstSignature.id);
  }
}

export { SignatureQueue };
