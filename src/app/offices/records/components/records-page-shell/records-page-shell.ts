import { Component, inject, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideShieldAlert } from '@ng-icons/lucide';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { OfficeContextService } from '../../../../office-platform/context/office-context.service';
import { RecordsService } from '../../services/records/records-service';

@Component({
  selector: 'nexus-records-page-shell',
  imports: [NgIcon, HlmBreadCrumbImports, HlmButtonImports, HlmSeparator, HlmSheetImports],
  templateUrl: './records-page-shell.html',
  providers: [provideIcons({ lucideChevronRight, lucideShieldAlert })],
})
class RecordsPageShell {
  readonly officeContext = inject(OfficeContextService);
  readonly records = inject(RecordsService);
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly holdNotice = input(false);
  readonly recordDrawer = input(false);
}

export { RecordsPageShell };
