import { Component, inject, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { LeadershipService } from '../../services/leadership/leadership-service';

@Component({
  selector: 'nexus-decision-detail',
  imports: [NgIcon, HlmButtonImports, HlmSeparator, HlmSheetImports],
  templateUrl: './decision-detail.html',
  providers: [provideIcons({ lucideCheck })],
})
export class DecisionDetail {
  private readonly leadership = inject(LeadershipService);

  readonly decisionId = input.required<string>();
  readonly label = input('Review context');
  readonly selectedDecision = this.leadership.selectedDecision;

  select(): void {
    this.leadership.selectDecision(this.decisionId());
  }
}
