import { BaseStaffEntity } from './BaseStaff.api';
import type { AuthorizationScope } from '../authorization/AuthorizationScope.api';
import type { EffectiveRoleAssignment } from '../authorization/RoleAssignment.api';

interface StaffProfileApi extends BaseStaffEntity {
  media: {
    profilePicUrl: string | null;
    signatureUrl: string | null;
  };
}

interface StaffAuthorityApi {
  roles: string[];
  capabilities: string[];
  roleAssignments: EffectiveRoleAssignment[];
  capabilityScopes: Record<string, AuthorizationScope[]>;
}

/** Exact data payload returned by GET /identity/staff/me. */
interface StaffContextApi {
  staff: StaffProfileApi;
  authority: StaffAuthorityApi;
}

/** Flattened application model retained for existing current-staff consumers. */
interface StaffLoginApi extends StaffProfileApi {
  authority: StaffAuthorityApi;
}

export type {
  StaffAuthorityApi,
  StaffContextApi,
  StaffLoginApi,
  StaffProfileApi,
};
