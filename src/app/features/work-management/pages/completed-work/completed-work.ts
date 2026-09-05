import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEye, lucideFilter, lucideSearch } from '@ng-icons/lucide';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { OfficeContextService } from '../../../../office-platform/context/office-context.service';

const completedItems = [
  {
    id: '0801',
    reference: 'NF/REG/2026/0801',
    title: 'Council implementation brief',
    outcome: 'Recommendation accepted',
    completed: '28 Aug 2026 · 16:42',
    authority: 'Registrar',
    state: 'Approved',
    version: 'v4 · signed',
  },
  {
    id: '0788',
    reference: 'NF/REG/2026/0788',
    title: 'Budget variance review',
    outcome: 'Minute adopted with conditions',
    completed: '27 Aug 2026 · 14:18',
    authority: 'Bursar',
    state: 'Action issued',
    version: 'v6 · authoritative',
  },
  {
    id: '0774',
    reference: 'NF/REG/2026/0774',
    title: 'Laboratory evidence check',
    outcome: 'Evidence verified',
    completed: '26 Aug 2026 · 11:05',
    authority: 'Director, Academic Planning',
    state: 'Completed',
    version: 'v3 · declared',
  },
] as const;

@Component({
  selector: 'nexus-completed-work',
  imports: [
    NgIcon,
    RouterLink,
    HlmBreadCrumbImports,
    HlmButtonImports,
    HlmInput,
    HlmSeparator,
    HlmTableImports,
  ],
  templateUrl: './completed-work.html',
  providers: [provideIcons({ lucideEye, lucideFilter, lucideSearch })],
})
export class CompletedWork {
  readonly officeContext = inject(OfficeContextService);
  readonly workItems = completedItems;
}
