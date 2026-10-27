import { Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight } from '@ng-icons/lucide';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmCheckbox } from '@spartan-ng/helm/checkbox';
import { HlmTextarea } from '@spartan-ng/helm/textarea';
import type { AuthorityAction } from '../../../../models/ui/governance/AuthorityAction.ui';

@Component({
  selector: 'nexus-records-authority-dialog',
  imports: [NgIcon, HlmAlertDialogImports, HlmCheckbox, HlmTextarea],
  templateUrl: './records-authority-dialog.html',
  providers: [provideIcons({ lucideArrowRight })],
})
class RecordsAuthorityDialog {
  readonly action = input.required<AuthorityAction>();
}

export { RecordsAuthorityDialog };
