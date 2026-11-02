import type { StaffAuthorityApi } from '../../models/api/staff/StaffLogin.api';
import type { OfficeWorkbenchKey } from '../../models/ui/office-platform/office-workbench';

type GovernedProfileField =
  | 'firstName'
  | 'middleName'
  | 'lastName'
  | 'email'
  | 'phoneNumber'
  | 'profilePicture'
  | 'signature';

type FieldGovernanceMode = 'direct' | 'approval_required' | 'read_only';

interface IdentityProfileDto {
  firstName: string;
  middleName: string | null;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  profilePictureUrl: string | null;
  signature: {
    present: boolean;
    updatedAt: string | null;
  };
}

interface IdentityEmploymentDto {
  id: string;
  identityId: string;
  staffNumber: number;
  employmentType: string;
  unit: {
    sector: string;
    name: string;
    id: string;
  };
  office: {
    id: string;
    name: string;
    workbench?: OfficeWorkbenchKey;
  };
  designation: {
    id: string;
    title: string;
  };
  status: string;
  createdAt: string;
  updatedAt: string | null;
}

interface IdentityFieldGovernanceDto {
  mode: FieldGovernanceMode;
  reasonCode: string;
  requirements: string[];
}

interface IdentityGovernanceDto {
  policy: {
    key: string;
    version: number;
  };
  fields: Partial<Record<GovernedProfileField, IdentityFieldGovernanceDto>>;
}

interface IdentityChangeRequestDto {
  id: string;
  status: string;
  changes: Partial<Record<GovernedProfileField, unknown>>;
  reason: string;
  policy: {
    key: string;
    version: number;
  };
  createdAt: string;
  updatedAt?: string | null;
}

interface IdentityMeDto {
  profile: IdentityProfileDto;
  employment: IdentityEmploymentDto;
  authority: StaffAuthorityApi;
  governance: IdentityGovernanceDto;
  pendingChangeRequests: IdentityChangeRequestDto[];
  revision: number;
}

interface UpdateIdentityProfileCommand {
  phoneNumber: string | null;
}

interface ProfileMutationResultDto {
  profile: IdentityProfileDto;
  revision: number;
}

interface ChangeRequestMediaResultDto {
  mediaId: string;
}

interface CreateIdentityChangeRequestCommand {
  changes: Partial<Record<'firstName' | 'middleName' | 'lastName' | 'email' | 'signature', string | null>>;
  reason: string;
  evidenceMediaIds: string[];
}

interface CreateIdentityChangeRequestResultDto {
  request: IdentityChangeRequestDto;
}

export type {
  ChangeRequestMediaResultDto,
  CreateIdentityChangeRequestCommand,
  CreateIdentityChangeRequestResultDto,
  FieldGovernanceMode,
  GovernedProfileField,
  IdentityChangeRequestDto,
  IdentityEmploymentDto,
  IdentityFieldGovernanceDto,
  IdentityGovernanceDto,
  IdentityMeDto,
  IdentityProfileDto,
  ProfileMutationResultDto,
  UpdateIdentityProfileCommand,
};
