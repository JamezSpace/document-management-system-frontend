import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBadgeCheck, lucideShieldCheck } from '@ng-icons/lucide';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import type {
  SensitivityChangeDto,
  SensitivityDecision,
} from '../../../../../../api/documents/governance.contracts';
import type { EmptyStateConfig } from '../../../../../../models/ui/global/EmptyState.ui';
import { EmptyState } from '../../../../../../shared/components/empty-state/empty-state';
import { GovernanceService } from '../../../../../../features/workspace/service/data/governance-service';

@Component({
  selector: 'nexus-sensitivity-approvals',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    NgIcon,
    HlmAlertDialogImports,
    HlmSeparator,
    HlmSpinner,
    EmptyState,
  ],
  templateUrl: './sensitivity-approvals.html',
  providers: [provideIcons({ lucideBadgeCheck, lucideShieldCheck })],
})
export class SensitivityApprovals implements OnInit {
  readonly governanceService = inject(GovernanceService);
  readonly queue = this.governanceService.pendingSensitivityChanges;
  readonly selectedRequest = signal<SensitivityChangeDto | null>(null);
  readonly selectedDecision = signal<SensitivityDecision>('approve');
  readonly reviewReason = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(2000)],
  });
  readonly emptyState: EmptyStateConfig = {
    kind: 'completed',
    iconName: 'lucideCircleCheckBig',
    title: 'No sensitivity decisions are waiting',
    description: 'Downgrade requests for units under your effective authority will appear here.',
  };

  ngOnInit(): void {
    this.governanceService.loadPendingSensitivityChanges();
  }

  prepareDecision(request: SensitivityChangeDto, decision: SensitivityDecision): void {
    this.selectedRequest.set(request);
    this.selectedDecision.set(decision);
    this.reviewReason.reset('');
  }

  submitDecision(): void {
    const request = this.selectedRequest();
    if (!request || this.reviewReason.invalid) {
      this.reviewReason.markAsTouched();
      return;
    }

    this.governanceService.reviewSensitivityChange(
      request,
      this.selectedDecision(),
      this.reviewReason.value.trim(),
    );
  }

  loadMore(): void {
    const pageInfo = this.queue()?.pageInfo;
    if (pageInfo?.hasMore && pageInfo.nextCursor) {
      this.governanceService.loadPendingSensitivityChanges(pageInfo.limit, pageInfo.nextCursor, true);
    }
  }
}
