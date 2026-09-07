interface LeadershipMetric {
  label: string;
  value: string;
  note: string;
  icon: string;
  tone: string;
}

interface LeadershipRisk {
  stream: string;
  state: string;
  tone: string;
}

interface LeadershipDirectiveSummary {
  title: string;
  status: string;
}

interface LeadershipEscalation {
  id: string;
  urgency: string;
  cause: string;
  title: string;
  owner: string;
  age: string;
  authority: string;
  request: string;
}

interface LeadershipWorkloadRow {
  id: string;
  name: string;
  role: string;
  availability: string;
  activeAssignments: number;
  overdue: number;
  upcomingDeadlines: string;
  capacityContext: string;
}

interface LeadershipAuditEvent {
  id: string;
  occurredAt: string;
  decision: string;
  authority: string;
  object: string;
  rationale: string;
  outcome: string;
  lifecycleChange: string;
}

export type {
  LeadershipAuditEvent,
  LeadershipDirectiveSummary,
  LeadershipEscalation,
  LeadershipMetric,
  LeadershipRisk,
  LeadershipWorkloadRow,
};
