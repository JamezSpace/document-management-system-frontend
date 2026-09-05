interface WorkItemQueryApi {
  search?: string;
  authorityId?: string;
  status?: string;
  dueFrom?: string;
  dueTo?: string;
  completedFrom?: string;
  completedTo?: string;
  sort?: string;
  limit?: number;
  cursor?: string;
}

interface WorkItemPageInfoApi {
  nextCursor: string | null;
  hasNextPage: boolean;
}

interface WorkItemPageApi<T> {
  items: T[];
  pageInfo: WorkItemPageInfoApi;
}

export type { WorkItemPageApi, WorkItemPageInfoApi, WorkItemQueryApi };
