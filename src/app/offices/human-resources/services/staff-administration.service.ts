import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { StaffAdministrationApi } from '../../../api/identity/staff-administration.api';
import type {
  AdministrativeStaffDto,
  DecideIdentityChangeCommand,
  IdentityChangeRequestPageDto,
  IdentityChangeRequestQuery,
  StaffListDto,
  StaffListQuery,
  TransitionStaffStatusCommand,
  UpdateAdministrativeStaffCommand,
} from '../../../api/identity/staff-administration.contracts';
import type { AppError } from '../../../models/ui/global/ErrorPresentation.ui';

const emptyStaffPage = (): StaffListDto => ({
  items: [],
  total: 0,
  page: 1,
  pageSize: 25,
  totalPages: 0,
});

const emptyReviewPage = (): IdentityChangeRequestPageDto => ({
  items: [],
  total: 0,
  page: 1,
  pageSize: 25,
  totalPages: 0,
});

@Injectable({ providedIn: 'root' })
class StaffAdministrationService {
  private readonly api = inject(StaffAdministrationApi);

  readonly staffPage = signal<StaffListDto>(emptyStaffPage());
  readonly selectedStaff = signal<AdministrativeStaffDto | null>(null);
  readonly selectedStaffEtag = signal<string | null>(null);
  readonly reviewPage = signal<IdentityChangeRequestPageDto>(emptyReviewPage());
  readonly loading = signal(false);
  readonly detailLoading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  private staffQuery: StaffListQuery = { page: 1, pageSize: 25 };
  private reviewQuery: IdentityChangeRequestQuery = { page: 1, pageSize: 25, status: 'pending' };

  async loadStaff(query: StaffListQuery = this.staffQuery): Promise<void> {
    this.staffQuery = { page: 1, pageSize: 25, ...query };
    this.loading.set(true);
    this.error.set(null);
    try {
      const response = await firstValueFrom(this.api.listStaff(this.staffQuery));
      this.staffPage.set(response.data);
    } catch (error) {
      this.error.set(this.messageFor(error));
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  async loadStaffDetail(staffId: string): Promise<AdministrativeStaffDto> {
    this.detailLoading.set(true);
    this.error.set(null);
    try {
      const response = await firstValueFrom(this.api.getStaff(staffId));
      const staff = response.body?.data;
      if (!staff) throw new Error('The staff detail response was empty.');
      this.acceptStaff(staff, response.headers.get('ETag'));
      return staff;
    } catch (error) {
      this.error.set(this.messageFor(error));
      throw error;
    } finally {
      this.detailLoading.set(false);
    }
  }

  async updateStaff(command: UpdateAdministrativeStaffCommand): Promise<AdministrativeStaffDto> {
    return this.mutateSelected((staffId, etag) => this.api.updateStaff(staffId, etag, command));
  }

  async transitionStatus(
    command: TransitionStaffStatusCommand,
  ): Promise<AdministrativeStaffDto> {
    return this.mutateSelected((staffId, etag) =>
      this.api.transitionStatus(staffId, etag, command),
    );
  }

  async loadIdentityChangeRequests(
    query: IdentityChangeRequestQuery = this.reviewQuery,
  ): Promise<void> {
    this.reviewQuery = { page: 1, pageSize: 25, status: 'pending', ...query };
    this.loading.set(true);
    this.error.set(null);
    try {
      const response = await firstValueFrom(
        this.api.listIdentityChangeRequests(this.reviewQuery),
      );
      this.reviewPage.set(response.data);
    } catch (error) {
      this.error.set(this.messageFor(error));
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  async decideIdentityChange(
    requestId: string,
    command: DecideIdentityChangeCommand,
  ): Promise<void> {
    this.saving.set(true);
    this.error.set(null);
    try {
      await firstValueFrom(this.api.decideIdentityChange(requestId, command));
      await this.loadIdentityChangeRequests(this.reviewQuery);
    } catch (error) {
      this.error.set(this.messageFor(error));
      throw error;
    } finally {
      this.saving.set(false);
    }
  }

  clearSelection(): void {
    this.selectedStaff.set(null);
    this.selectedStaffEtag.set(null);
  }

  private async mutateSelected(
    mutation: (
      staffId: string,
      etag: string,
    ) => ReturnType<StaffAdministrationApi['updateStaff']>,
  ): Promise<AdministrativeStaffDto> {
    const selected = this.selectedStaff();
    const etag = this.selectedStaffEtag();
    if (!selected || !etag) throw new Error('Load the current staff record before changing it.');

    this.saving.set(true);
    this.error.set(null);
    try {
      const response = await firstValueFrom(mutation(selected.staffId, etag));
      const staff = response.body?.data;
      if (!staff) throw new Error('The staff mutation response was empty.');
      this.acceptStaff(staff, response.headers.get('ETag'));
      return staff;
    } catch (error) {
      this.error.set(this.messageFor(error));
      if (this.isRevisionConflict(error)) await this.loadStaffDetail(selected.staffId);
      throw error;
    } finally {
      this.saving.set(false);
    }
  }

  private acceptStaff(staff: AdministrativeStaffDto, etag: string | null): void {
    this.selectedStaff.set(staff);
    this.selectedStaffEtag.set(etag ?? `"staff-${staff.revision}"`);
    this.staffPage.update((page) => ({
      ...page,
      items: page.items.map((item) => (item.staffId === staff.staffId ? staff : item)),
    }));
  }

  private isRevisionConflict(error: unknown): boolean {
    return (error as AppError)?.apiError?.code?.codeName === 'staff_revision_conflict';
  }

  private messageFor(error: unknown): string {
    if (error instanceof Error) return error.message;
    return (error as AppError)?.message ?? 'The staff administration request could not be completed.';
  }
}

export { StaffAdministrationService };
