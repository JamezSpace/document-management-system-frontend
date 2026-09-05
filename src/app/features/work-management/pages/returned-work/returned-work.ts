import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideFilter, lucideSearch } from '@ng-icons/lucide';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import type { WorkItem } from '../../../../models/ui/work-management/WorkItem.ui';
import { OfficeContextService } from '../../../../office-platform/context/office-context.service';

const returnedItems: Record<string, WorkItem> = {
  '653ce198': {
    id: '653ce198',
    reference: 'NF/REG/2026/0819',
    title: 'Faculty workload reconciliation',
    instruction: 'Correct the staff totals and resubmit the supporting schedule.',
    authority: 'Deputy Registrar',
    received: '27 Aug 2026 · 11:45',
    deadline: '1 Sep 2026 · 10:00',
    status: 'Returned for correction',
    version: 'v2 · submitted 27 Aug',
    classification: 'Internal · Human resources',
    returnReason:
      'The total academic staff count does not reconcile with the attached departmental schedules.',
    correction:
      'Reconcile the department totals, attach the corrected schedule and explain the variance.',
    activity: ['Submitted for review', 'Returned by Deputy Registrar', 'New deadline assigned'],
  },
  '21d409ba': {
    id: '21d409ba',
    reference: 'NF/REG/2026/0837',
    title: 'Procurement evaluation report',
    instruction: 'Attach the missing declarations and update the compliance minute.',
    authority: 'Head, Procurement Office',
    received: '28 Aug 2026 · 14:10',
    deadline: 'Today · 16:00',
    status: 'Returned for correction',
    version: 'v4 · submitted 28 Aug',
    classification: 'Confidential · Procurement',
    returnReason: 'Two mandatory evaluation declarations are missing from the submitted version.',
    correction: 'Attach the signed declarations and update the compliance minute.',
    activity: ['Submitted for review', 'Returned by Head, Procurement Office', 'Correction due today'],
  },
};

@Component({
  selector: 'nexus-returned-work',
  imports: [
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
export class ReturnedWork {
  readonly officeContext = inject(OfficeContextService);
  readonly workItems = Object.values(returnedItems);
  readonly selectedItem = signal<WorkItem>(returnedItems['653ce198']);

  selectItem(id: string): void {
    this.selectedItem.set(returnedItems[id] ?? returnedItems['653ce198']);
  }
}
