import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideFilter, lucideSearch } from '@ng-icons/lucide';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { OfficeContextService } from '../../../../office-platform/context/office-context.service';
import { WorkItemsService } from '../../services/work-items/work-items-service';

@Component({
  selector: 'nexus-returned-work',
  imports: [
    DatePipe,
    NgIcon,
    RouterLink,
    HlmBreadCrumbImports,
    HlmButtonImports,
    HlmCardImports,
    HlmInput,
    HlmSeparator,
    HlmSheetImports,
  ],
  templateUrl: './returned-work.html',
  providers: [provideIcons({ lucideArrowRight, lucideFilter, lucideSearch })],
})
export class ReturnedWork implements OnInit {
  readonly officeContext = inject(OfficeContextService);
  readonly workItemsService = inject(WorkItemsService);
  readonly selectedItem = computed(() => {
    const item = this.workItemsService.selectedItem();
    return item?.view === 'returned' ? item : null;
  });

  ngOnInit(): void {
    this.workItemsService.loadReturned();
  }

  selectItem(id: string): void {
    this.workItemsService.loadDetail(id);
  }
}
