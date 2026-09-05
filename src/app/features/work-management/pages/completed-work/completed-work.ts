import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEye, lucideFilter, lucideSearch } from '@ng-icons/lucide';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { OfficeContextService } from '../../../../office-platform/context/office-context.service';
import { WorkItemsService } from '../../services/work-items/work-items-service';

@Component({
  selector: 'nexus-completed-work',
  imports: [
    DatePipe,
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
export class CompletedWork implements OnInit {
  readonly officeContext = inject(OfficeContextService);
  readonly workItemsService = inject(WorkItemsService);

  ngOnInit(): void {
    this.workItemsService.loadCompleted();
  }
}
