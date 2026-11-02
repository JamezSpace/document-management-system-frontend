type StaffStatus = 'active' | 'suspended' | 'retired' | 'resigned' | 'terminated';
type IdentityChangeDecision = 'approve' | 'reject';

interface AdministrativeStaffDto {
  staffId: string;
  identityId: string;
  revision: number;
  firstName: string;
  middleName: string | null;
  lastName: string;
  fullName: string;
  email: string;
  staffNumber: number;
  employmentType: string;
  status: StaffStatus | string;
  unit: { id: string; name: string };
  office: { id: string; name: string };
  designation: { id: string; title: string };
  createdAt: string;
  updatedAt: string | null;
}

interface StaffListQuery {
  page?: number;
  pageSize?: number;
  status?: StaffStatus;
  unitId?: string;
  search?: string;
}

interface StaffListDto {
  items: AdministrativeStaffDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface UpdateAdministrativeStaffCommand {
  changes: {
    staffNumber?: number;
    employmentType?: string;
    unitId?: string;
    officeId?: string;
    designationId?: string;
  };
  reason: string;
}

interface TransitionStaffStatusCommand {
  toStatus: StaffStatus;
  reason: string;
}

interface IdentityChangeRequestReviewDto {
  requestId: string;
  requestGroupId: string;
  identityId: string;
  staffId: string;
  submittedBy?: string;
  submittedByStaffId?: string;
  field: string;
  previousValue: unknown;
  requestedValue: unknown;
  evidenceMediaIds: string[];
  submitterReason?: string;
  reason?: string;
  policy?: { key: string; version: number };
  policyKey?: string;
  policyVersion?: number;
  status: string;
  createdAt: string;
  reviewedAt?: string | null;
}

interface IdentityChangeRequestQuery {
  page?: number;
  pageSize?: number;
  status?: string;
}

interface IdentityChangeRequestPageDto {
  items: IdentityChangeRequestReviewDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface DecideIdentityChangeCommand {
  decision: IdentityChangeDecision;
  reason: string;
}

interface IdentityChangeDecisionResultDto {
  requestId: string;
  requestGroupId: string;
  status: 'applied' | 'rejected';
  field: string;
  newRevision: number | null;
  reviewedBy: string;
  reviewReason: string;
}

export type {
  AdministrativeStaffDto,
  DecideIdentityChangeCommand,
  IdentityChangeDecision,
  IdentityChangeDecisionResultDto,
  IdentityChangeRequestPageDto,
  IdentityChangeRequestQuery,
  IdentityChangeRequestReviewDto,
  StaffListDto,
  StaffListQuery,
  StaffStatus,
  TransitionStaffStatusCommand,
  UpdateAdministrativeStaffCommand,
};
