import { Component, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideBadgeCheck, lucideCalendarCheck, lucideChevronRight, lucideFilter, lucideLayoutGrid, lucideList } from '@ng-icons/lucide';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCheckbox } from '@spartan-ng/helm/checkbox';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmTextarea } from '@spartan-ng/helm/textarea';
import type { AuthorityAction } from '../../../../models/ui/governance/AuthorityAction.ui';
import { OfficeContextService } from '../../../../office-platform/context/office-context.service';

@Component({
  selector: 'nexus-leave-management',
  imports: [NgIcon, HlmAlertDialogImports, HlmBreadCrumbImports, HlmButtonImports, HlmCardImports, HlmCheckbox, HlmSeparator, HlmTextarea],
  templateUrl: './leave-management.html',
  providers: [provideIcons({ lucideArrowRight, lucideBadgeCheck, lucideCalendarCheck, lucideChevronRight, lucideFilter, lucideLayoutGrid, lucideList })],
})
class LeaveManagement {
  readonly officeContext = inject(OfficeContextService);
  readonly leaveView = signal<'calendar' | 'queue'>('calendar');
  readonly authorityAction = signal<AuthorityAction>(this.leaveApproval());

  prepareLeaveApproval(): void { this.authorityAction.set(this.leaveApproval()); }

  prepareLeaveCancellation(): void {
    this.authorityAction.set({ title: 'Cancel approved leave', currentState: 'Approved · scheduled', proposedState: 'Cancelled · balance restored', authority: 'Head of Human Resources acting on a valid cancellation request', consequence: 'The leave schedule is withdrawn and the affected balance is restored subject to payroll cut-off.', reversible: 'A new leave request is required after cancellation.', evidence: 'Cancelling authority, request source, reason, balance adjustment, coverage notification and timestamp.', confirmLabel: 'Cancel approved leave', destructive: true });
  }

  private leaveApproval(): AuthorityAction {
    return { title: 'Approve leave request', currentState: 'Recommended · awaiting HR authority', proposedState: 'Approved · leave schedule committed', authority: 'Head of Human Resources acting within delegated leave authority', consequence: 'The approved dates reduce the staff balance and activate the recorded coverage arrangement.', reversible: 'Cancellation requires a separate audited authority action.', evidence: 'Approver, balance before and after, dates, coverage assessment, conflicts, rationale and timestamp.', confirmLabel: 'Approve leave' };
  }
}

export { LeaveManagement };
