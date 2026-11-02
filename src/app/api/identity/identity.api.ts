import { HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiClient } from '../client/api-client';
import type { StaffContextDto } from './identity.contracts';
import type {
  ChangeRequestMediaResultDto,
  CreateIdentityChangeRequestCommand,
  CreateIdentityChangeRequestResultDto,
  IdentityChangeRequestDto,
  IdentityMeDto,
  ProfileMutationResultDto,
  UpdateIdentityProfileCommand,
} from './identity-self-service.contracts';

@Injectable({ providedIn: 'root' })
class IdentityApi {
  private readonly api = inject(ApiClient);

  getCurrentStaff(context?: HttpContext) {
    return this.api.get<StaffContextDto>('identity/staff/me', context);
  }

  getMe(context?: HttpContext) {
    return this.api.getResponse<IdentityMeDto>('identity/me', { context });
  }

  updateProfile(etag: string, command: UpdateIdentityProfileCommand) {
    return this.api.patchResponse<ProfileMutationResultDto>('identity/me/profile', command, {
      headers: { 'If-Match': etag },
    });
  }

  updateProfilePicture(etag: string, file: File) {
    const body = new FormData();
    body.append('profilePicture', file);

    return this.api.putResponse<ProfileMutationResultDto>('identity/me/profile-picture', body, {
      headers: { 'If-Match': etag },
    });
  }

  uploadChangeRequestMedia(purpose: 'evidence' | 'signature', file: File) {
    const body = new FormData();
    body.append('purpose', purpose);
    body.append('file', file);
    return this.api.post<ChangeRequestMediaResultDto>('identity/me/change-request-media', body);
  }

  createChangeRequest(command: CreateIdentityChangeRequestCommand) {
    return this.api.post<CreateIdentityChangeRequestResultDto>(
      'identity/me/change-requests',
      command,
    );
  }

  listChangeRequests() {
    return this.api.get<IdentityChangeRequestDto[]>('identity/me/change-requests');
  }
}

export { IdentityApi };
