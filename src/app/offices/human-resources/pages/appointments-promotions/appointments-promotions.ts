import { Component, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideAward } from '@ng-icons/lucide';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCheckbox } from '@spartan-ng/helm/checkbox';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { HlmTextarea } from '@spartan-ng/helm/textarea';
import type { AuthorityAction } from '../../../../models/ui/governance/AuthorityAction.ui';
import { OfficeContextService } from '../../../../office-platform/context/office-context.service';

@Component({
  selector: 'nexus-appointments-promotions',
  imports: [NgIcon, HlmAlertDialogImports, HlmBreadCrumbImports, HlmButtonImports, HlmCardImports, HlmCheckbox, HlmSeparator, HlmSheetImports, HlmTextarea],
  templateUrl: './appointments-promotions.html',
  providers: [provideIcons({ lucideArrowRight, lucideAward })],
})
class AppointmentsPromotions {
  readonly officeContext = inject(OfficeContextService);
  readonly appointmentStage = signal('Awaiting authority');
  readonly appointmentStages = ['Initiated', 'Documents pending', 'Under review', 'Awaiting authority', 'Approved', 'Completed'] as const;
  readonly authorityAction = signal<AuthorityAction>({ title: 'Approve appointment case', currentState: 'Evidence complete · awaiting authority', proposedState: 'Approved · instrument generation authorized', authority: 'Appointments Authority acting within the sanctioned establishment and approved exercise', consequence: 'Approval authorizes the appointment or promotion instrument and reserves the sanctioned position.', reversible: 'Only through a recorded superseding or revocation decision.', evidence: 'Authority role, case evidence, establishment position, decision rationale, effective date and timestamp.', confirmLabel: 'Approve case' });

  prepareAppointmentApproval(): void { this.authorityAction.set({ ...this.authorityAction() }); }
}

export { AppointmentsPromotions };
