import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideFilter, lucideListTodo, lucidePanelRightOpen, lucideSearch } from '@ng-icons/lucide';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { HlmTableImports } from '@spartan-ng/helm/table';
import type { WorkItem } from '../../../../models/ui/work-management/WorkItem.ui';
import { OfficeContextService } from '../../../../office-platform/context/office-context.service';

const workItems: Record<string, WorkItem> = {
  '8fae41c2': {
    id: '8fae41c2',
    reference: 'NF/REG/2026/0841',
    title: 'Industrial attachment policy review',
    instruction: 'Minute implementation recommendation',
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
    instruction: 'Validate evaluation criteria',
    authority: 'Head, Procurement Office',
    received: '28 Aug 2026 · 14:10',
    deadline: 'Today · 12:30',
    status: 'Due soon',
    version: 'v5 · submitted',
    classification: 'Confidential · Procurement',
    activity: ['Assigned by Head, Procurement Office', 'Confidential access granted', 'Review not yet started'],
  },
  '653ce198': {
    id: '653ce198',
    reference: 'NF/REG/2026/0819',
    title: 'Faculty workload reconciliation',
    instruction: 'Correct totals and resubmit',
    authority: 'Deputy Registrar',
    received: '27 Aug 2026 · 11:45',
    deadline: '1 Sep 2026 · 10:00',
    status: 'Returned',
    version: 'v2 · returned',
    classification: 'Internal · Human resources',
    returnReason: 'The total academic staff count does not reconcile with the attached departmental schedules.',
    correction: 'Reconcile the department totals, attach the corrected schedule and explain the variance.',
    activity: ['Submitted for review', 'Returned by Deputy Registrar', 'New deadline assigned'],
  },
};

@Component({
  selector: 'nexus-assigned-documents',
  imports: [NgIcon, RouterLink, HlmBreadCrumbImports, HlmButtonImports, HlmInput, HlmSeparator, HlmSheetImports, HlmTableImports],
  templateUrl: './assigned-documents.html',
  providers: [provideIcons({ lucideArrowRight, lucideFilter, lucideListTodo, lucidePanelRightOpen, lucideSearch })],
})
export class AssignedDocuments {
  readonly officeContext = inject(OfficeContextService);
  readonly workItems = Object.values(workItems);
  readonly selectedItem = signal<WorkItem>(workItems['8fae41c2']);

  selectItem(id: string): void {
    this.selectedItem.set(workItems[id] ?? workItems['8fae41c2']);
  }
}
