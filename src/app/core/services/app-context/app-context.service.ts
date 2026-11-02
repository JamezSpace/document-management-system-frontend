import { HttpContext } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { IdentityApi } from '../../../api/identity/identity.api';
import type { StaffActor } from '../../../api/identity/identity.contracts';
import type { AuthorizationScope } from '../../../models/api/authorization/AuthorizationScope.api';

@Injectable({ providedIn: 'root' })
class AppContextService {
  private readonly identityApi = inject(IdentityApi);

  readonly actor = signal<StaffActor | null>(null);
  readonly authority = computed(() => this.actor()?.authority ?? null);
  readonly capabilities = computed(() => new Set(this.authority()?.capabilities ?? []));

  async load(context?: HttpContext): Promise<StaffActor> {
    const response = await firstValueFrom(this.identityApi.getMe(context));
    const identity = response.body?.data;
    if (!identity) throw new Error('The identity response did not include a profile.');

    const profile = identity.profile;
    const actor: StaffActor = {
      ...identity.employment,
      firstName: profile.firstName,
      middleName: profile.middleName ?? '',
      lastName: profile.lastName,
      fullName: [profile.firstName, profile.middleName, profile.lastName].filter(Boolean).join(' '),
      email: profile.email,
      media: {
        profilePicUrl: profile.profilePictureUrl,
        // Self-service responses deliberately expose presence metadata, never the signature asset.
        signatureUrl: null,
      },
      authority: identity.authority,
    };
    this.actor.set(actor);
    return actor;
  }

  can(capability: string): boolean {
    return this.capabilities().has(capability);
  }

  canInScope(capability: string, scope: AuthorizationScope): boolean {
    return (this.authority()?.capabilityScopes[capability] ?? []).some(
      (candidate) =>
        candidate.type === 'organization' ||
        (candidate.type === scope.type && candidate.id === scope.id),
    );
  }

  reset(): void {
    this.actor.set(null);
  }
}

export { AppContextService };
