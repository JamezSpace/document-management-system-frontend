import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideFilter, lucideMessageSquareText, lucideSearch } from '@ng-icons/lucide';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import type { WorkItem } from '../../../../models/ui/work-management/WorkItem.ui';

const reviewItems: Record<string, WorkItem> = {
  '8fae41c2': {
    id: '8fae41c2',
    reference: 'NF/REG/2026/0841',
    title: 'Industrial attachment policy review',
    instruction: 'Recommend implementation timetable',
    authority: 'Director, Academic Planning',
    received: '29 Aug 2026 · 09:24',
    deadline: 'Today · 15:00',
    status: 'Awaiting review',
    version: 'v3 · submitted',
    classification: 'Internal · Student services',
    activity: ['Assigned by Director, Academic Planning', 'Authoritative version v3 supplied', 'Reviewer access recorded'],
  },
  '21d409ba': {
    id: '21d409ba',
    reference: 'NF/REG/2026/0837',
    title: 'Procurement evaluation report',
    instruction: 'Confirm evaluation compliance',
    authority: 'Head, Procurement Office',
    received: '28 Aug 2026 · 14:10',
    deadline: 'Today · 12:30',
    status: 'Due soon',
    version: 'v5 · submitted',
    classification: 'Confidential · Procurement',
    activity: ['Assigned by Head, Procurement Office', 'Confidential access granted', 'Four previous minutes linked'],
  },
};

@Component({
  selector: 'nexus-reviews-minutes',
  imports: [NgIcon, RouterLink, HlmBreadCrumbImports, HlmButtonImports, HlmCardImports, HlmInput, HlmSeparator, HlmSheetImports],
  templateUrl: './reviews-minutes.html',
  providers: [provideIcons({ lucideArrowRight, lucideFilter, lucideMessageSquareText, lucideSearch })],
})
export class ReviewsMinutes {
  readonly reviews = [
    { ...reviewItems['8fae41c2'], minutes: '2 previous minutes' },
    { ...reviewItems['21d409ba'], minutes: '4 previous minutes' },
  ];
  readonly selectedItem = signal<WorkItem>(reviewItems['8fae41c2']);

  selectItem(id: string): void {
    this.selectedItem.set(reviewItems[id] ?? reviewItems['8fae41c2']);
  }
}
