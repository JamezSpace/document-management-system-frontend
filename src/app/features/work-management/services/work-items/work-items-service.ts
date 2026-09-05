import { inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { WorkItemsApi } from '../../../../api/work-management/work-items.api';
import type {
  AssignedWorkItemApi,
  CompletedWorkItemApi,
  ReturnedWorkItemApi,
  WorkItemDetailApi,
} from '../../../../models/api/work-management/WorkItem.api';
import type { WorkItemQueryApi } from '../../../../models/api/work-management/WorkItemQuery.api';
import type { AppError } from '../../../../models/ui/global/ErrorPresentation.ui';
import type {
  AssignedWorkItem,
  CompletedWorkItem,
  ManagedWorkItem,
  ReturnedWorkItem,
  WorkItemDetail,
} from '../../../../models/ui/work-management/WorkAssignment.ui';
import type {
  WorkItemPageInfo,
  WorkItemQuery,
} from '../../../../models/ui/work-management/WorkItemQuery.ui';

@Injectable({ providedIn: 'root' })
export class WorkItemsService {
  private readonly api = inject(WorkItemsApi);

  readonly assignedItems = signal<AssignedWorkItem[]>([]);
  readonly returnedItems = signal<ReturnedWorkItem[]>([]);
  readonly completedItems = signal<CompletedWorkItem[]>([]);
  readonly selectedItem = signal<WorkItemDetail | null>(null);

  readonly assignedPageInfo = signal<WorkItemPageInfo | null>(null);
  readonly returnedPageInfo = signal<WorkItemPageInfo | null>(null);
  readonly completedPageInfo = signal<WorkItemPageInfo | null>(null);

  readonly assignedLoading = signal(false);
  readonly returnedLoading = signal(false);
  readonly completedLoading = signal(false);
  readonly detailLoading = signal(false);
  readonly error = signal<AppError | null>(null);

  loadAssigned(query: WorkItemQuery = {}, append = false): void {
    this.assignedLoading.set(true);
    this.error.set(null);
    this.api
      .listAssigned(this.toApiQuery(query))
      .pipe(finalize(() => this.assignedLoading.set(false)))
      .subscribe({
        next: (response) => {
          const items = response.data.items.map((item) => this.mapAssigned(item));
          this.assignedItems.update((current) => (append ? [...current, ...items] : items));
          this.assignedPageInfo.set(response.data.pageInfo);
        },
        error: (error: AppError) => this.error.set(error),
      });
  }

  loadReturned(query: WorkItemQuery = {}, append = false): void {
    this.returnedLoading.set(true);
    this.error.set(null);
    this.api
      .listReturned(this.toApiQuery(query))
      .pipe(finalize(() => this.returnedLoading.set(false)))
      .subscribe({
        next: (response) => {
          const items = response.data.items.map((item) => this.mapReturned(item));
          this.returnedItems.update((current) => (append ? [...current, ...items] : items));
          this.returnedPageInfo.set(response.data.pageInfo);
        },
        error: (error: AppError) => this.error.set(error),
      });
  }

  loadCompleted(query: WorkItemQuery = {}, append = false): void {
    this.completedLoading.set(true);
    this.error.set(null);
    this.api
      .listCompleted(this.toApiQuery(query))
      .pipe(finalize(() => this.completedLoading.set(false)))
      .subscribe({
        next: (response) => {
          const items = response.data.items.map((item) => this.mapCompleted(item));
          this.completedItems.update((current) => (append ? [...current, ...items] : items));
          this.completedPageInfo.set(response.data.pageInfo);
        },
        error: (error: AppError) => this.error.set(error),
      });
  }

  loadDetail(workItemId: string): void {
    this.detailLoading.set(true);
    this.error.set(null);
    this.api
      .getDetail(workItemId)
      .pipe(finalize(() => this.detailLoading.set(false)))
      .subscribe({
        next: (response) => this.selectedItem.set(this.mapDetail(response.data)),
        error: (error: AppError) => this.error.set(error),
      });
  }

  clearDetail(): void {
    this.selectedItem.set(null);
  }

  private toApiQuery(query: WorkItemQuery): WorkItemQueryApi {
    return {
      ...query,
      dueFrom: query.dueFrom?.toISOString(),
      dueTo: query.dueTo?.toISOString(),
      completedFrom: query.completedFrom?.toISOString(),
      completedTo: query.completedTo?.toISOString(),
    };
  }

  private mapAssigned(item: AssignedWorkItemApi): AssignedWorkItem {
    return {
      ...item,
      assignedAt: new Date(item.assignedAt),
      dueAt: new Date(item.dueAt),
    };
  }

  private mapReturned(item: ReturnedWorkItemApi): ReturnedWorkItem {
    return {
      ...item,
      assignedAt: new Date(item.assignedAt),
      returnedAt: new Date(item.returnedAt),
      resubmissionDueAt: new Date(item.resubmissionDueAt),
      previousSubmission: {
        ...item.previousSubmission,
        submittedAt: new Date(item.previousSubmission.submittedAt),
      },
    };
  }

  private mapCompleted(item: CompletedWorkItemApi): CompletedWorkItem {
    return {
      ...item,
      assignedAt: new Date(item.assignedAt),
      completedAt: new Date(item.completedAt),
    };
  }

  private mapDetail(item: WorkItemDetailApi): WorkItemDetail {
    const workItem: ManagedWorkItem = this.mapWorkItem(item);
    return {
      ...workItem,
      activity: item.activity.map((activity) => ({
        ...activity,
        occurredAt: new Date(activity.occurredAt),
      })),
    };
  }

  private mapWorkItem(item: WorkItemDetailApi): ManagedWorkItem {
    switch (item.view) {
      case 'assigned':
        return this.mapAssigned(item);
      case 'returned':
        return this.mapReturned(item);
      case 'completed':
        return this.mapCompleted(item);
    }
  }
}
