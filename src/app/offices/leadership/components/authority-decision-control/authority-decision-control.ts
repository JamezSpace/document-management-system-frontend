import { Component, inject, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucidePenTool } from '@ng-icons/lucide';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCheckbox } from '@spartan-ng/helm/checkbox';
import { HlmTextarea } from '@spartan-ng/helm/textarea';
import { LeadershipService } from '../../services/leadership/leadership-service';

@Component({
  selector: 'nexus-authority-decision-control',
  imports: [NgIcon, HlmAlertDialogImports, HlmButtonImports, HlmCheckbox, HlmTextarea],
  templateUrl: './authority-decision-control.html',
  providers: [provideIcons({ lucideArrowRight, lucidePenTool })],
})
export class AuthorityDecisionControl {
  private readonly leadership = inject(LeadershipService);

  readonly decisionId = input<string>();
  readonly label = input('Decide');
  readonly mode = input<'approve' | 'reject'>('approve');
  readonly icon = input<string>();
  readonly authorityAction = this.leadership.authorityAction;

  prepare(): void {
    const decisionId = this.decisionId();
    if (decisionId) this.leadership.selectDecision(decisionId);

    if (this.mode() === 'reject') this.leadership.prepareRejection();
    else this.leadership.prepareApproval();
  }
}
