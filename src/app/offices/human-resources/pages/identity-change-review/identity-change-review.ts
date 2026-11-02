import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideArrowRight,
  lucideBadgeCheck,
  lucideFileCheck2,
  lucideRefreshCw,
  lucideShieldAlert,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmTextarea } from '@spartan-ng/helm/textarea';
import type {
  IdentityChangeDecision,
  IdentityChangeRequestReviewDto,
} from '../../../../api/identity/staff-administration.contracts';
import { ToastService } from '../../../../core/services/notifications/toast-service';
import { CurrentStaffService } from '../../../../features/shared/services/current-staff/current-staff-service';
import { StaffAdministrationService } from '../../services/staff-administration.service';

@Component({
  selector: 'nexus-identity-change-review',
  imports: [
    NgIcon,
    ReactiveFormsModule,
    HlmButtonImports,
    HlmCardImports,
    HlmSeparator,
    HlmTextarea,
  ],
  templateUrl: './identity-change-review.html',
  providers: [
    provideIcons({
      lucideArrowLeft,
      lucideArrowRight,
      lucideBadgeCheck,
      lucideFileCheck2,
      lucideRefreshCw,
      lucideShieldAlert,
    }),
  ],
})
class IdentityChangeReview implements OnInit {
  readonly administration = inject(StaffAdministrationService);
  private readonly currentStaff = inject(CurrentStaffService);
  private readonly toast = inject(ToastService);

  readonly selected = signal<IdentityChangeRequestReviewDto | null>(null);
  readonly status = new FormControl('pending', { nonNullable: true });
  readonly decisionForm = new FormGroup({
    decision: new FormControl<IdentityChangeDecision>('approve', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    reason: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  async load(page = 1): Promise<void> {
    this.selected.set(null);
    try {
      await this.administration.loadIdentityChangeRequests({
        page,
        pageSize: 25,
        status: this.status.value || undefined,
      });
    } catch {
      // Normalized errors are presented globally and retained inline.
    }
  }

  select(request: IdentityChangeRequestReviewDto): void {
    this.selected.set(request);
    this.decisionForm.reset({ decision: 'approve', reason: '' });
  }

  isOwnRequest(request: IdentityChangeRequestReviewDto): boolean {
    return this.submitter(request) === this.currentStaff.data()?.id;
  }

  submitter(request: IdentityChangeRequestReviewDto): string {
    return request.submittedByStaffId ?? request.submittedBy ?? 'Unknown staff member';
  }

  requestReason(request: IdentityChangeRequestReviewDto): string {
    return request.submitterReason ?? request.reason ?? 'No reason supplied';
  }

  policyLabel(request: IdentityChangeRequestReviewDto): string {
    const key = request.policy?.key ?? request.policyKey ?? 'Identity governance';
    const version = request.policy?.version ?? request.policyVersion;
    return version === undefined ? key : `${key} · v${version}`;
  }

  async decide(): Promise<void> {
    const request = this.selected();
    if (!request || this.isOwnRequest(request) || this.decisionForm.invalid) {
      this.decisionForm.markAllAsTouched();
      return;
    }
    const decision = this.decisionForm.getRawValue();
    try {
      await this.administration.decideIdentityChange(request.requestId, {
        decision: decision.decision,
        reason: decision.reason.trim(),
      });
      this.selected.set(null);
      this.toast.success(
        decision.decision === 'approve'
          ? 'Identity change approved and applied.'
          : 'Identity change rejected.',
      );
    } catch {
      // Self-review, policy and synchronization failures are normalized globally.
    }
  }

  displayValue(value: unknown): string {
    if (value === null || value === undefined || value === '') return 'Not set';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  formatDate(value: string): string {
    return new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium', timeStyle: 'short' }).format(
      new Date(value),
    );
  }
}

export { IdentityChangeReview };
