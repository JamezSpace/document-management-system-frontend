import { Component, computed, inject, signal } from '@angular/core';
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
import type { WorkItem } from '../../../../models/ui/work-management/WorkItem.ui';

export type ProcessingScreenKey = 'overview' | 'escalated';

const workItems: Record<string, WorkItem> = {
  '8fae41c2': {
    id: '8fae41c2',
    reference: 'NF/REG/2026/0841',
    title: 'Industrial attachment policy review',
    instruction: 'Review the implementation timetable and minute a recommendation for executive attention.',
    authority: 'Director, Academic Planning',
    received: '29 Aug 2026 · 09:24',
    deadline: 'Today · 15:00',
    status: 'In progress',
    version: 'v3 · hash verified',
    classification: 'Internal · Student services',
    activity: ['Assigned by Director, Academic Planning', 'Opened in reviewer workspace', 'Draft minute saved'],
  },
  '21d409ba': {
    id: '21d409ba',
    reference: 'NF/REG/2026/0837',
    title: 'Procurement evaluation report',
    instruction: 'Validate the evaluation record against the approved procurement criteria.',
    authority: 'Head, Procurement Office',
    received: '28 Aug 2026 · 14:10',
    deadline: 'Today · 12:30',
    status: 'Due soon',
    version: 'v5 · submitted',
    classification: 'Confidential · Procurement',
    activity: ['Assigned by Head, Procurement Office', 'Confidential access granted', 'Review not yet started'],
  },
};


@Component({
  selector: 'nexus-overview',
  imports: [
    NgIcon,
    RouterLink,
    HlmBreadCrumbImports,
    HlmButtonImports,
    HlmCardImports,
    HlmSeparator,
    HlmSheetImports,
    HlmTableImports,
  ],
  templateUrl: './overview.html',
  viewProviders: [provideIcons({
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
  })],
})
export class Overview {
    private readonly route = inject(ActivatedRoute);

  readonly screen = computed(() => this.route.snapshot.data['screen'] as ProcessingScreenKey);
  readonly title = computed(() => this.route.snapshot.data['title'] as string);
  readonly description = computed(() => this.route.snapshot.data['description'] as string);
  readonly selectedItem = signal<WorkItem>(workItems['8fae41c2']);

  selectItem(id: string): void {
    this.selectedItem.set(workItems[id] ?? workItems['8fae41c2']);
  }
}
