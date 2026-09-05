interface WorkItemQuery {
  search?: string;
  authorityId?: string;
  status?: string;
  dueFrom?: Date;
  dueTo?: Date;
  completedFrom?: Date;
  completedTo?: Date;
  sort?: string;
  limit?: number;
  cursor?: string;
}

interface WorkItemPageInfo {
  nextCursor: string | null;
  hasNextPage: boolean;
}

export type { WorkItemPageInfo, WorkItemQuery };
