import { Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleAlert, lucideFilter, lucideShieldCheck } from '@ng-icons/lucide';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCheckbox } from '@spartan-ng/helm/checkbox';
import { HlmTableImports } from '@spartan-ng/helm/table';
import type { AuthorityAction } from '../../../../models/ui/governance/AuthorityAction.ui';
import { RecordsAuthorityDialog } from '../../components/records-authority-dialog/records-authority-dialog';
import { RecordsPageShell } from '../../components/records-page-shell/records-page-shell';

const dispositionAction: AuthorityAction = { title: 'Approve controlled disposition', currentState: 'Eligible · awaiting independent approval', proposedState: 'Approved for controlled destruction', authority: 'Independent Records Authority; the proposing officer cannot self-approve', consequence: 'The approved batch enters the destruction schedule. Legal-hold items remain excluded.', reversible: 'No. Destruction is irreversible after execution.', evidence: 'Eligibility result, independent approver, justification, acknowledgement and destruction certificate.', confirmLabel: 'Approve disposition', destructive: true };

@Component({ selector: 'nexus-retention-disposition', imports: [NgIcon, HlmAlertDialogImports, HlmButtonImports, HlmCheckbox, HlmTableImports, RecordsAuthorityDialog, RecordsPageShell], templateUrl: './retention-disposition.html', providers: [provideIcons({ lucideCircleAlert, lucideFilter, lucideShieldCheck })] })
class RetentionDisposition {
  readonly retentionTab = signal('Due');
  readonly retentionTabs = ['Due', 'Upcoming', 'On hold', 'Awaiting approval', 'Completed'] as const;
  readonly authorityAction = dispositionAction;
}

export { RetentionDisposition };
