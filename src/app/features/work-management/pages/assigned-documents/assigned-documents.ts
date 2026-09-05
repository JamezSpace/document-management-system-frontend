import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowRight,
  lucideFilter,
  lucideListTodo,
  lucidePanelRightOpen,
  lucideSearch,
} from '@ng-icons/lucide';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { OfficeContextService } from '../../../../office-platform/context/office-context.service';
import { WorkItemsService } from '../../services/work-items/work-items-service';

@Component({
  selector: 'nexus-assigned-documents',
  imports: [
    DatePipe,
    NgIcon,
    RouterLink,
    HlmBreadCrumbImports,
    HlmButtonImports,
    HlmInput,
    HlmSeparator,
    HlmSheetImports,
    HlmTableImports,
  ],
  templateUrl: './assigned-documents.html',
  providers: [
    provideIcons({
      lucideArrowRight,
      lucideFilter,
      lucideListTodo,
      lucidePanelRightOpen,
      lucideSearch,
    }),
  ],
})
export class AssignedDocuments implements OnInit {
  readonly officeContext = inject(OfficeContextService);
  readonly workItemsService = inject(WorkItemsService);
  readonly selectedItem = computed(() => {
    const item = this.workItemsService.selectedItem();
    return item?.view === 'assigned' ? item : null;
  });

  ngOnInit(): void {
    this.workItemsService.loadAssigned();
  }

  selectItem(id: string): void {
    this.workItemsService.loadDetail(id);
  }
}
