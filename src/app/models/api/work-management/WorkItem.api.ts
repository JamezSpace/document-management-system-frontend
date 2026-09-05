interface WorkItemAuthorityApi {
  actorId: string | null;
  designationId: string | null;
  displayName: string;
  role: string;
}

interface WorkItemVersionApi {
  id: string;
  number: number;
  label: string;
  integrityStatus: string;
}

interface WorkItemDocumentApi {
  id: string;
  reference: string;
  title: string;
  classification: string;
  sensitivity: string;
  version: WorkItemVersionApi;
}

interface WorkItemActivityApi {
  id: string;
  event: string;
  actor: WorkItemAuthorityApi;
  occurredAt: string;
  evidenceId: string | null;
}

interface BaseWorkItemApi {
  id: string;
  document: WorkItemDocumentApi;
  instruction: string;
  assigningAuthority: WorkItemAuthorityApi;
  assignedAt: string;
}

interface AssignedWorkItemApi extends BaseWorkItemApi {
  view: 'assigned';
  status: 'assigned' | 'in_progress' | 'due_soon';
  dueAt: string;
  progressLabel: string | null;
}

interface ReturnedWorkItemApi extends BaseWorkItemApi {
  view: 'returned';
  status: 'returned';
  returnedAt: string;
  returnedBy: WorkItemAuthorityApi;
  returnReason: string;
  requiredCorrection: string;
  resubmissionDueAt: string;
  previousSubmission: WorkItemVersionApi & {
    submittedAt: string;
  };
}

interface CompletedWorkItemApi extends BaseWorkItemApi {
  view: 'completed';
  status: 'completed';
  outcome: string;
  completedAt: string;
  finalAuthority: WorkItemAuthorityApi;
  resultingState: string;
  authoritativeVersion: WorkItemVersionApi;
}

type WorkItemApi = AssignedWorkItemApi | ReturnedWorkItemApi | CompletedWorkItemApi;

type WorkItemDetailApi = WorkItemApi & {
  activity: WorkItemActivityApi[];
};

export type {
  AssignedWorkItemApi,
  BaseWorkItemApi,
  CompletedWorkItemApi,
  ReturnedWorkItemApi,
  WorkItemActivityApi,
  WorkItemApi,
  WorkItemAuthorityApi,
  WorkItemDetailApi,
  WorkItemDocumentApi,
  WorkItemVersionApi,
};
