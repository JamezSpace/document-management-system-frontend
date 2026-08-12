import { HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiClient } from '../client/api-client';
import type { StaffContextDto } from './identity.contracts';

@Injectable({ providedIn: 'root' })
export class IdentityApi {
  private readonly api = inject(ApiClient);

  getCurrentStaff(context?: HttpContext) {
    return this.api.get<StaffContextDto>('identity/staff/me', context);
  }
}
