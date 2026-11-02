import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom, forkJoin } from 'rxjs';
import { IdentityApi } from '../../../api/identity/identity.api';
import type {
  CreateIdentityChangeRequestCommand,
  GovernedProfileField,
  IdentityChangeRequestDto,
  IdentityMeDto,
} from '../../../api/identity/identity-self-service.contracts';
import type { AppError } from '../../../models/ui/global/ErrorPresentation.ui';
import { AppContextService } from '../../../core/services/app-context/app-context.service';

interface GovernedChangeSubmission {
  changes: CreateIdentityChangeRequestCommand['changes'];
  reason: string;
  evidence: File[];
  signature: File | null;
}

@Injectable()
class IdentitySelfService {
  private readonly api = inject(IdentityApi);
  private readonly appContext = inject(AppContextService);

  readonly identity = signal<IdentityMeDto | null>(null);
  readonly etag = signal<string | null>(null);
  readonly history = signal<IdentityChangeRequestDto[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly profile = computed(() => this.identity()?.profile ?? null);
  readonly employment = computed(() => this.identity()?.employment ?? null);

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const [meResponse, historyResponse] = await firstValueFrom(
        forkJoin([this.api.getMe(), this.api.listChangeRequests()]),
      );
      const identity = meResponse.body?.data;
      if (!identity) throw new Error('The identity response did not include profile data.');

      this.acceptIdentity(identity, meResponse.headers.get('ETag'));
      this.history.set(historyResponse.data);
    } catch (error) {
      this.error.set(this.messageFor(error));
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  governanceFor(field: GovernedProfileField) {
    return this.identity()?.governance.fields[field] ?? null;
  }

  async updatePhone(phoneNumber: string | null): Promise<void> {
    const etag = this.requiredEtag();
    await this.runMutation(async () => {
      const response = await firstValueFrom(this.api.updateProfile(etag, { phoneNumber }));
      const result = response.body?.data;
      if (!result) throw new Error('The profile update response was empty.');
      this.acceptProfile(result.profile, result.revision, response.headers.get('ETag'));
    });
  }

  async updateProfilePicture(file: File): Promise<void> {
    const etag = this.requiredEtag();
    await this.runMutation(async () => {
      const response = await firstValueFrom(this.api.updateProfilePicture(etag, file));
      const result = response.body?.data;
      if (!result) throw new Error('The profile-picture response was empty.');
      this.acceptProfile(result.profile, result.revision, response.headers.get('ETag'));
    });
  }

  async submitGovernedChange(submission: GovernedChangeSubmission): Promise<void> {
    this.saving.set(true);
    this.error.set(null);

    try {
      const evidenceMediaIds = await Promise.all(
        submission.evidence.map(async (file) => {
          const response = await firstValueFrom(
            this.api.uploadChangeRequestMedia('evidence', file),
          );
          return response.data.mediaId;
        }),
      );

      const changes = { ...submission.changes };
      if (submission.signature) {
        const response = await firstValueFrom(
          this.api.uploadChangeRequestMedia('signature', submission.signature),
        );
        changes.signature = response.data.mediaId;
      }

      await firstValueFrom(
        this.api.createChangeRequest({
          changes,
          reason: submission.reason,
          evidenceMediaIds,
        }),
      );

      const history = await firstValueFrom(this.api.listChangeRequests());
      this.history.set(history.data);
      await this.refreshIdentity();
    } catch (error) {
      this.error.set(this.messageFor(error));
      throw error;
    } finally {
      this.saving.set(false);
    }
  }

  private async refreshIdentity(): Promise<void> {
    const response = await firstValueFrom(this.api.getMe());
    const identity = response.body?.data;
    if (identity) this.acceptIdentity(identity, response.headers.get('ETag'));
  }

  private async runMutation(mutation: () => Promise<void>): Promise<void> {
    this.saving.set(true);
    this.error.set(null);
    try {
      await mutation();
    } catch (error) {
      this.error.set(this.messageFor(error));
      if (this.isRevisionConflict(error)) await this.refreshIdentity();
      throw error;
    } finally {
      this.saving.set(false);
    }
  }

  private acceptIdentity(identity: IdentityMeDto, etag: string | null): void {
    this.identity.set(identity);
    this.etag.set(etag ?? `"profile-${identity.revision}"`);
    this.synchronizeActor(identity.profile);
  }

  private acceptProfile(
    profile: IdentityMeDto['profile'],
    revision: number,
    etag: string | null,
  ): void {
    this.identity.update((identity) =>
      identity ? { ...identity, profile, revision } : identity,
    );
    this.etag.set(etag ?? `"profile-${revision}"`);
    this.synchronizeActor(profile);
  }

  private synchronizeActor(profile: IdentityMeDto['profile']): void {
    this.appContext.actor.update((actor) =>
      actor
        ? {
            ...actor,
            firstName: profile.firstName,
            middleName: profile.middleName ?? '',
            lastName: profile.lastName,
            fullName: [profile.firstName, profile.middleName, profile.lastName]
              .filter(Boolean)
              .join(' '),
            email: profile.email,
            media: { ...actor.media, profilePicUrl: profile.profilePictureUrl, signatureUrl: null },
          }
        : actor,
    );
  }

  private requiredEtag(): string {
    const etag = this.etag();
    if (!etag) throw new Error('Load the current profile before making changes.');
    return etag;
  }

  private isRevisionConflict(error: unknown): boolean {
    return (error as AppError)?.apiError?.code?.codeName === 'identity_revision_conflict';
  }

  private messageFor(error: unknown): string {
    if (error instanceof Error) return error.message;
    return (error as AppError)?.message ?? 'The identity request could not be completed.';
  }
}

export type { GovernedChangeSubmission };
export { IdentitySelfService };
