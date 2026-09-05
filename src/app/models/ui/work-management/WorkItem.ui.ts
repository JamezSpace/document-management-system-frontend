interface WorkItem {
  id: string;
  reference: string;
  title: string;
  instruction: string;
  authority: string;
  received: string;
  deadline: string;
  status: string;
  version: string;
  classification: string;
  returnReason?: string;
  correction?: string;
  activity: readonly string[];
}

export type { WorkItem };
