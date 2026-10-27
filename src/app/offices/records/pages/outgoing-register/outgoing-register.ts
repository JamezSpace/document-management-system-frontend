import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFilter, lucidePanelRightOpen, lucideSearch, lucideSend, lucideShieldCheck } from '@ng-icons/lucide';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { HlmTableImports } from '@spartan-ng/helm/table';
import type { AuthorityAction } from '../../../../models/ui/governance/AuthorityAction.ui';
import { RecordsAuthorityDialog } from '../../components/records-authority-dialog/records-authority-dialog';
import { RecordsPageShell } from '../../components/records-page-shell/records-page-shell';
import { RecordsService } from '../../services/records/records-service';

const dispatchAction: AuthorityAction = { title: 'Authorize dispatch', currentState: 'Registered for dispatch', proposedState: 'Authorized for release', authority: 'Head of Secretariat acting within the outgoing correspondence policy', consequence: 'The item becomes eligible for external release and delivery tracking.', reversible: 'No. A corrective event must be recorded if authorization is withdrawn.', evidence: 'Identity, role scope, timestamp, justification, record revision and dispatch evidence.', confirmLabel: 'Authorize dispatch' };

@Component({ selector: 'nexus-outgoing-register', imports: [NgIcon, HlmAlertDialogImports, HlmButtonImports, HlmInput, HlmSheetImports, HlmTableImports, RecordsAuthorityDialog, RecordsPageShell], templateUrl: './outgoing-register.html', providers: [provideIcons({ lucideFilter, lucidePanelRightOpen, lucideSearch, lucideSend, lucideShieldCheck })] })
class OutgoingRegister { readonly records = inject(RecordsService); readonly authorityAction = dispatchAction; }

export { OutgoingRegister };
