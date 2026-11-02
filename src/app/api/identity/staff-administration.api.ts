import { inject, Injectable } from '@angular/core';
import { ApiClient } from '../client/api-client';
import type {
  AdministrativeStaffDto,
  DecideIdentityChangeCommand,
  IdentityChangeDecisionResultDto,
  IdentityChangeRequestPageDto,
  IdentityChangeRequestQuery,
  StaffListDto,
  StaffListQuery,
  TransitionStaffStatusCommand,
  UpdateAdministrativeStaffCommand,
} from './staff-administration.contracts';

@Injectable({ providedIn: 'root' })
class StaffAdministrationApi {
  private readonly api = inject(ApiClient);

  listStaff(query: StaffListQuery = {}) {
    return this.api.get<StaffListDto>('identity/staff', undefined, this.compactParams(query));
  }

  getStaff(staffId: string) {
    return this.api.getResponse<AdministrativeStaffDto>(`identity/staff/${staffId}`);
  }

  updateStaff(staffId: string, etag: string, command: UpdateAdministrativeStaffCommand) {
    return this.api.patchResponse<AdministrativeStaffDto>(`identity/staff/${staffId}`, command, {
      headers: { 'If-Match': etag },
    });
  }

  transitionStatus(
    staffId: string,
    etag: string,
    command: TransitionStaffStatusCommand,
  ) {
    return this.api.postResponse<AdministrativeStaffDto>(
      `identity/staff/${staffId}/status-transitions`,
      command,
      { headers: { 'If-Match': etag } },
    );
  }

  listIdentityChangeRequests(query: IdentityChangeRequestQuery = {}) {
    return this.api.get<IdentityChangeRequestPageDto>(
      'identity/identity-change-requests',
      undefined,
      this.compactParams(query),
    );
  }

  decideIdentityChange(requestId: string, command: DecideIdentityChangeCommand) {
    return this.api.post<IdentityChangeDecisionResultDto>(
      `identity/identity-change-requests/${requestId}/decision`,
      command,
    );
  }

  private compactParams(source: object): Record<string, string | number | boolean> {
    const params: Record<string, string | number | boolean> = {};
    for (const [key, value] of Object.entries(source)) {
      if (
        (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') &&
        value !== ''
      ) {
        params[key] = value;
      }
    }
    return params;
  }
}

export { StaffAdministrationApi };
