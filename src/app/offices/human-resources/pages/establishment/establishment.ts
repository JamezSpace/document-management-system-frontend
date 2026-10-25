import { Component, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBriefcaseBusiness, lucideFilter, lucideList, lucideNetwork } from '@ng-icons/lucide';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { OfficeContextService } from '../../../../office-platform/context/office-context.service';

@Component({ selector: 'nexus-establishment', imports: [NgIcon, HlmBreadCrumbImports, HlmButtonImports, HlmCardImports, HlmSeparator, HlmTableImports], templateUrl: './establishment.html', providers: [provideIcons({ lucideBriefcaseBusiness, lucideFilter, lucideList, lucideNetwork })] })
class Establishment {
  readonly officeContext = inject(OfficeContextService);
  readonly establishmentView = signal<'hierarchy' | 'table'>('hierarchy');
}

export { Establishment };
