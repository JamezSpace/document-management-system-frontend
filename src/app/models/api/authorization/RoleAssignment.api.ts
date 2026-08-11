import type { AuthorizationScope } from './AuthorizationScope.api';

type RoleAssignmentSource = 'manual' | 'derived' | 'delegated';

/** Effective assignment returned as part of GET /identity/staff/me. */
interface EffectiveRoleAssignment {
  assignmentId: string;
  role: string;
  scope: AuthorizationScope;
  source: RoleAssignmentSource;
  validFrom: string;
  validTo: string | null;
  assignedBy: string;
  delegatedBy: string | null;
}

/** Full assignment returned by the role-assignment management endpoints. */
interface RoleAssignment {
  assignmentId: string;
  staffId: string;
  role: {
    id: string;
    name: string;
  };
  scope: AuthorizationScope;
  source: RoleAssignmentSource;
  validFrom: string;
  validTo: string | null;
  assignedBy: string;
  delegatedBy: string | null;
  revokedBy: string | null;
  revokedAt: string | null;
  createdAt: string;
}

export type {
  EffectiveRoleAssignment,
  RoleAssignment,
  RoleAssignmentSource,
};
