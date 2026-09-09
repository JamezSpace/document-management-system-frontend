import type { HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type {
  AssignedWorkItemApi,
  CompletedWorkItemApi,
  ReturnedWorkItemApi,
  WorkItemDetailApi,
} from '../../models/api/work-management/WorkItem.api';
import type {
  WorkItemPageApi,
  WorkItemQueryApi,
} from '../../models/api/work-management/WorkItemQuery.api';
import { ApiClient } from '../client/api-client';

@Injectable({ providedIn: 'root' })
export class WorkItemsApi {
  private readonly api = inject(ApiClient);

  listAssigned(query: WorkItemQueryApi = {}, context?: HttpContext) {
    return this.api.get<WorkItemPageApi<AssignedWorkItemApi>>(
      'work-items',
      context,
      this.params('assigned', query),
    );
  }

  listReturned(query: WorkItemQueryApi = {}, context?: HttpContext) {
    return this.api.get<WorkItemPageApi<ReturnedWorkItemApi>>(
      'work-items',
      context,
      this.params('returned', query),
    );
  }

  listCompleted(query: WorkItemQueryApi = {}, context?: HttpContext) {
    return this.api.get<WorkItemPageApi<CompletedWorkItemApi>>(
      'work-items',
      context,
      this.params('completed', query),
    );
  }

  getDetail(workItemId: string, context?: HttpContext) {
    return this.api.get<WorkItemDetailApi>(`work-items/${workItemId}`, context);
  }

  private params(
    view: 'assigned' | 'returned' | 'completed',
    query: WorkItemQueryApi,
  ): Record<string, string | number | boolean> {
    return Object.fromEntries(
      Object.entries({ view, ...query }).filter((entry) => entry[1] !== undefined),
    ) as Record<string, string | number | boolean>;
  }
}
