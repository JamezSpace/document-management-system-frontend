import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideAlarmClock,
  lucideArrowRight,
  lucideCalendarClock,
  lucideCheck,
  lucideChevronRight,
  lucideListTodo,
  lucidePanelRightOpen,
  lucideShieldCheck,
  lucideTriangleAlert,
  lucideUndo2,
  lucideUsers,
} from '@ng-icons/lucide';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { WorkItemsService } from '../../../../features/work-management/services/work-items/work-items-service';
import { DatePipe } from '@angular/common';


export type ProcessingScreenKey = 'overview' | 'escalated';

@Component({
  selector: 'nexus-processing-overview',
  imports: [
    DatePipe,
    NgIcon,
    RouterLink,
    HlmBreadCrumbImports,
    HlmButtonImports,
    HlmCardImports,
    HlmSeparator,
    HlmSheetImports,
    HlmTableImports,
  ],
  templateUrl: './processing-overview.html',
  viewProviders: [
    provideIcons({
      lucideAlarmClock,
      lucideArrowRight,
      lucideCalendarClock,
      lucideCheck,
      lucideChevronRight,
      lucideListTodo,
      lucidePanelRightOpen,
      lucideShieldCheck,
      lucideTriangleAlert,
      lucideUndo2,
      lucideUsers,
    }),
  ],
})
export class ProcessingOverview {
    private readonly route = inject(ActivatedRoute);
  readonly workItemsService = inject(WorkItemsService);

  readonly screen = computed(() => this.route.snapshot.data['screen'] as ProcessingScreenKey);
  readonly title = computed(() => this.route.snapshot.data['title'] as string);
  readonly description = computed(() => this.route.snapshot.data['description'] as string);
  readonly selectedItem = computed(() => {
    const item = this.workItemsService.selectedItem();
    return item?.view === 'assigned' ? item : null;
  });

  selectItem(id: string): void {
    this.workItemsService.loadDetail(id);
  }
}
