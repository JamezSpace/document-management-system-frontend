interface LeadershipDecision {
  id: string;
  kind: 'approval' | 'signature' | 'escalation';
  reference: string;
  title: string;
  decision: string;
  requester: string;
  authority: string;
  deadline: string;
  version: string;
  classification: string;
  effect: string;
  authorship: string;
  approvals: readonly string[];
  activity: readonly string[];
}

export type { LeadershipDecision };
