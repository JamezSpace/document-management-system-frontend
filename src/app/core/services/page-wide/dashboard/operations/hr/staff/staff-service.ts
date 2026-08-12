import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { environment } from '../../../../../../../../environments/environment.development';
import { ApiResponse } from '../../../../../../../models/api/ApiResponse.api';
import type { AppError } from '../../../../../../../models/ui/global/ErrorPresentation.ui';
import { DesignationApi } from '../../../../../../../models/api/organization/designation.api';
import { OfficeApi } from '../../../../../../../models/api/organization/offices.api';
import { InitStaffPayload } from '../../../../../../../models/api/staff/InitStaff.api';
import { StaffWithMedia } from '../../../../../../../models/api/staff/StaffWithMedia.api';
import { Users } from '../../../../../../../models/api/users/users.api';
import { UtilService } from '../../../../../../../shared/utils/service/util-service';
import { CurrentStaffService } from '../../../../../../../features/shared/services/current-staff/current-staff-service';

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  private http = inject(HttpClient);
  private utilService = inject(UtilService);
  private currentStaffService = inject(CurrentStaffService);
  private router = inject(Router);

  initStaff = signal<InitStaffPayload | null>(null);
  staff = signal<StaffWithMedia[]>([]);
  users = signal<Users[]>([]);
  officesInUnit = signal<OfficeApi[]>([]);
  officesDesignations = signal<DesignationApi[]>([]);
  loading = signal<boolean>(false);
  error = signal<AppError | null>(null);

  readonly loggedInStaff = this.currentStaffService.data()!;

  fetchAllUsers() {
        this.loading.set(true);

        this.http
        .get<ApiResponse<Users[]>>(`${environment.api}/identity/users`)
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe({
            next: (resp) => this.users.set(resp.data),
            error: (err) => this.error.set(err),
        });
    }

  fetchAllStaff() {
    this.loading.set(true);

    this.http
      .get<ApiResponse<StaffWithMedia[]>>(`${environment.api}/identity/staff`)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => this.staff.set(resp.data),
        error: (err) => this.error.set(err),
      });
  }

  newlyAddedStaffId = signal<string>('');
  addNewStaff(payload: InitStaffPayload) {
    this.loading.set(true);

    this.http
      .post<ApiResponse<string>>(`${environment.api}/identity/staff/register`, payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => {
          this.newlyAddedStaffId.set(resp.data);

          this.router.navigateByUrl('/office/operations/staff');
        },
        error: (err: AppError) => {
          this.error.set(err);

          console.log(err);

          this.utilService.showToast(
            'error',
            err.message || 'Something went wrong. Try again!',
          );
        },
      });
  }

  isInviteMigratedToNewStaff = signal<boolean>(false);
  migrateInviteToNewStaff(inviteId: string) {
    this.loading.set(true);

    this.http
      .post<ApiResponse<void>>(`${environment.api}/identity/staff/invite`, {
        inviteId
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => {
          this.utilService.showToast('info', 'Staff account activated successfully.');
          
            this.isInviteMigratedToNewStaff.set(true);

          console.log(resp.data);          
        },
        error: (err: AppError) => {
          this.error.set(err);
          this.utilService.showToast(
            'error',
            err.message || 'Unable to activate staff account.',
          );
        },
      });
  }

  activateNewStaff(staffId: string, inviteId: string) {
    this.loading.set(true);

    this.http
      .patch<ApiResponse<void>>(`${environment.api}/identity/staff/${staffId}/activate`, {
         inviteId
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => console.log(resp.data),
        error: (err: AppError) => {
          this.error.set(err);
          this.utilService.showToast(
            'error',
            err.message || 'Unable to activate staff account.',
          );
        },
      });
  }

  updateStaff(
    staffId: string,
    payload: {
      officeId: string;
      designationId: string;
      employmentType: string;
      staffNumber: string;
    },
  ) {
    this.loading.set(true);

    // TODO: replace placeholder URL when endpoint is finalized
    this.http
      .patch<ApiResponse<StaffWithMedia>>(
        `${environment.api}/identity/staff/${staffId}`,
        payload,
      )
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => {
          const updated = resp.data;
          this.staff.update((list) =>
            list.map((item) => (item.id === updated.id ? updated : item)),
          );
          this.utilService.showToast('info', 'Staff record updated successfully.');
        },
        error: (err: AppError) => {
          this.error.set(err);
          this.utilService.showToast(
            'error',
            err.message || 'Unable to update staff record.',
          );
        },
      });
  }

  deleteStaff(staffId: string) {
    this.loading.set(true);

    this.http
      .delete<ApiResponse<void>>(`${environment.api}/identity/staff/${staffId}`)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.staff.update((list) => list.filter((item) => item.id !== staffId));
          this.utilService.showToast('info', 'Staff record deleted successfully.');
        },
        error: (err: AppError) => {
          this.error.set(err);
          this.utilService.showToast(
            'error',
            err.message || 'Unable to delete staff record.',
          );
        },
      });
  }
}
