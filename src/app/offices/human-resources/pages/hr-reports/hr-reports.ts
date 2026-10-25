import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideDownload, lucideFileText, lucideFilter } from '@ng-icons/lucide';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCheckbox } from '@spartan-ng/helm/checkbox';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { OfficeContextService } from '../../../../office-platform/context/office-context.service';

@Component({ selector: 'nexus-hr-reports', imports: [NgIcon, HlmAlertDialogImports, HlmBreadCrumbImports, HlmButtonImports, HlmCardImports, HlmCheckbox, HlmInput, HlmSeparator], templateUrl: './hr-reports.html', providers: [provideIcons({ lucideDownload, lucideFileText, lucideFilter })] })
class HrReports {
  readonly officeContext = inject(OfficeContextService);
}

export { HrReports };
