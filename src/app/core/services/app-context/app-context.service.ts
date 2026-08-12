import { HttpContext } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { IdentityApi } from '../../../api/identity/identity.api';
import type { StaffActor } from '../../../api/identity/identity.contracts';
import type { AuthorizationScope } from '../../../models/api/authorization/AuthorizationScope.api';

@Injectable({ providedIn: 'root' })
export class AppContextService {
  private readonly identityApi = inject(IdentityApi);

  readonly actor = signal<StaffActor | null>(null);
  readonly authority = computed(() => this.actor()?.authority ?? null);
  readonly capabilities = computed(() => new Set(this.authority()?.capabilities ?? []));

  async load(context?: HttpContext): Promise<StaffActor> {
    const response = await firstValueFrom(this.identityApi.getCurrentStaff(context));
    const actor = { ...response.data.staff, authority: response.data.authority };
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
