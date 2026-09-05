interface WorkItemAuthority {
  actorId: string | null;
  designationId: string | null;
  displayName: string;
  role: string;
}

interface WorkItemVersion {
  id: string;
  number: number;
  label: string;
  integrityStatus: string;
}

interface WorkItemDocument {
  id: string;
  reference: string;
  title: string;
  classification: string;
  sensitivity: string;
  version: WorkItemVersion;
}

interface WorkItemActivity {
  id: string;
  event: string;
  actor: WorkItemAuthority;
  occurredAt: Date;
  evidenceId: string | null;
}

interface BaseWorkAssignment {
  id: string;
  document: WorkItemDocument;
  instruction: string;
  assigningAuthority: WorkItemAuthority;
  assignedAt: Date;
}

interface AssignedWorkItem extends BaseWorkAssignment {
  view: 'assigned';
  status: 'assigned' | 'in_progress' | 'due_soon';
  dueAt: Date;
  progressLabel: string | null;
}

interface ReturnedWorkItem extends BaseWorkAssignment {
  view: 'returned';
  status: 'returned';
  returnedAt: Date;
  returnedBy: WorkItemAuthority;
  returnReason: string;
  requiredCorrection: string;
  resubmissionDueAt: Date;
  previousSubmission: WorkItemVersion & {
    submittedAt: Date;
  };
}

interface CompletedWorkItem extends BaseWorkAssignment {
  view: 'completed';
  status: 'completed';
  outcome: string;
  completedAt: Date;
  finalAuthority: WorkItemAuthority;
  resultingState: string;
  authoritativeVersion: WorkItemVersion;
}

type ManagedWorkItem = AssignedWorkItem | ReturnedWorkItem | CompletedWorkItem;

type WorkItemDetail = ManagedWorkItem & {
  activity: WorkItemActivity[];
};

export type {
  AssignedWorkItem,
  BaseWorkAssignment,
  CompletedWorkItem,
  ManagedWorkItem,
  ReturnedWorkItem,
  WorkItemActivity,
  WorkItemAuthority,
  WorkItemDetail,
  WorkItemDocument,
  WorkItemVersion,
};
