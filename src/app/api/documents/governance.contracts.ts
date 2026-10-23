import type { CursorPageInfoDto } from './documents.contracts';

type DocumentSensitivity = 'public' | 'internal' | 'confidential' | 'restricted';
type GovernanceGrantType = 'guest_reader' | 'export';
type GovernanceGrantStatus = 'active' | 'expired' | 'exhausted' | 'revoked';
type GrantorAuthority = 'originator' | 'unit_head';
type SensitivityChangeStatus = 'pending' | 'approved' | 'rejected' | 'applied';
type SensitivityDecision = 'approve' | 'reject';

interface GovernanceGrantDto {
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

interface CreateGovernanceGrantCommand {
  granteeStaffId: string;
  grantType: GovernanceGrantType;
  reason: string;
  validTo: string;
  remainingUses: number | null;
}

interface CreateGovernanceGrantResult {
  grant: Pick<GovernanceGrantDto, 'id' | 'status'>;
  documentRevision: number;
}

interface RevokeGovernanceGrantResult {
  grantId: string;
  revoked: boolean;
  documentRevision: number;
}

interface SensitivityChangeDto {
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

interface RequestSensitivityChangeCommand {
  targetSensitivity: DocumentSensitivity;
  reason: string;
}

interface AppliedSensitivityChangeResult {
  status: 'applied';
  documentId: string;
  sensitivity: DocumentSensitivity;
  documentRevision: number;
}

type RequestSensitivityChangeResult = AppliedSensitivityChangeResult | SensitivityChangeDto;

interface ReviewSensitivityChangeResult {
  requestId: string;
  status: 'applied' | 'rejected';
  documentId: string;
  sensitivity?: DocumentSensitivity;
  documentRevision: number;
}

interface PendingSensitivityChangesDto {
  items: SensitivityChangeDto[];
  pageInfo: CursorPageInfoDto;
}

export type { DocumentSensitivity, GovernanceGrantType, GovernanceGrantStatus, GrantorAuthority, SensitivityChangeStatus, SensitivityDecision, GovernanceGrantDto, CreateGovernanceGrantCommand, CreateGovernanceGrantResult, RevokeGovernanceGrantResult, SensitivityChangeDto, RequestSensitivityChangeCommand, AppliedSensitivityChangeResult, RequestSensitivityChangeResult, ReviewSensitivityChangeResult, PendingSensitivityChangesDto };
