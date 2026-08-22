import type { CursorPageInfoDto } from './documents.contracts';

export type DocumentSensitivity = 'public' | 'internal' | 'confidential' | 'restricted';
export type GovernanceGrantType = 'guest_reader' | 'export';
export type GovernanceGrantStatus = 'active' | 'expired' | 'exhausted' | 'revoked';
export type GrantorAuthority = 'originator' | 'unit_head';
export type SensitivityChangeStatus = 'pending' | 'approved' | 'rejected' | 'applied';
export type SensitivityDecision = 'approve' | 'reject';

export interface GovernanceGrantDto {
  id: string;
  documentId: string;
  granteeStaffId: string;
  grantType: GovernanceGrantType;
  grantedBy: string;
  grantorAuthority: GrantorAuthority;
  reason: string;
  validFrom: string;
  validTo: string;
  remainingUses: number | null;
  status: GovernanceGrantStatus;
  revokedBy: string | null;
  revokedAt: string | null;
  revocationReason: string | null;
  createdAt: string;
}

export interface CreateGovernanceGrantCommand {
  granteeStaffId: string;
  grantType: GovernanceGrantType;
  reason: string;
  validTo: string;
  remainingUses: number | null;
}

export interface CreateGovernanceGrantResult {
  grant: Pick<GovernanceGrantDto, 'id' | 'status'>;
  documentRevision: number;
}

export interface RevokeGovernanceGrantResult {
  grantId: string;
  revoked: boolean;
  documentRevision: number;
}

export interface SensitivityChangeDto {
  id: string;
  documentId: string;
  fromSensitivity: DocumentSensitivity;
  toSensitivity: DocumentSensitivity;
  requestedBy: string;
  reason: string;
  status: SensitivityChangeStatus;
  requestedAt: string;
  reviewedBy: string | null;
  reviewReason: string | null;
  reviewedAt: string | null;
  appliedAt: string | null;
  documentRevision?: number;
}

export interface RequestSensitivityChangeCommand {
  targetSensitivity: DocumentSensitivity;
  reason: string;
}

export interface AppliedSensitivityChangeResult {
  status: 'applied';
  documentId: string;
  sensitivity: DocumentSensitivity;
  documentRevision: number;
}

export type RequestSensitivityChangeResult = AppliedSensitivityChangeResult | SensitivityChangeDto;

export interface ReviewSensitivityChangeResult {
  requestId: string;
  status: 'applied' | 'rejected';
  documentId: string;
  sensitivity?: DocumentSensitivity;
  documentRevision: number;
}

export interface PendingSensitivityChangesDto {
  items: SensitivityChangeDto[];
  pageInfo: CursorPageInfoDto;
}
