interface AuthorityAction {
  title: string;
  currentState: string;
  proposedState: string;
  authority: string;
  consequence: string;
  reversible: string;
  evidence: string;
  confirmLabel: string;
  description?: string;
  destructive?: boolean;
  reject?: boolean;
}

export type { AuthorityAction };
