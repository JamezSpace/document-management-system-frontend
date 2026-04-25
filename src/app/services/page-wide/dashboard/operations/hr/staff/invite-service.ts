import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { UtilService } from '../../../../../system-wide/util-service/util-service';
import { finalize } from 'rxjs';
import { environment } from '../../../../../../../environments/environment.development';
import { ApiResponse } from '../../../../../../interfaces/api/ApiResponse.interface';
import { InviteStaffPayload } from '../../../../../../interfaces/staff/InitStaff.api';
import { ErrorType } from '../../../../../../interfaces/api/Error.interface';
import { InvitesApi } from '../../../../../../interfaces/staff/Invites.api';

@Injectable({
  providedIn: 'root',
})
export class InviteService {
  private http = inject(HttpClient);
  private utilService = inject(UtilService);

  loading = signal<boolean>(false);
  error = signal<ErrorType | null>(null);

  invites = signal<InvitesApi[]>([]);
  inviteSent = signal<boolean>(false);
  initInvite(payload: InviteStaffPayload) {
    this.loading.set(true);

    this.http
      .post<ApiResponse<string>>(`${environment.api}/identity/staff/invite`, payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => {
          console.log(resp.data);

          this.inviteSent.set(true);
        },
        error: (err) => {
          this.error.set(err);

          this.utilService.showToast(
            'error',
            err.error.message || 'Something went wrong. Try again!',
          );
        },
      });
  }

  fetchAllInvites() {
    this.loading.set(true);

    this.http
      .get<ApiResponse<InvitesApi[]>>(`${environment.api}/identity/invites`)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => this.invites.set(resp.data),
        error: (err) => this.error.set(err),
      });
  }

  updateInvite(
    invitedId: string,
    payload: {
      officeId: string;
      designationId: string;
      employmentType: string;
      staffNumber: string;
    },
  ) {
    this.loading.set(true);

    // TODO: replace placeholder URL when endpoint is finalized
    // this.http
    //   .patch<ApiResponse<StaffWithMedia>>(
    //     `${environment.api}/identity/invite/${inviteId}/update`,
    //     payload,
    //   )
    //   .pipe(finalize(() => this.loading.set(false)))
    //   .subscribe({
    //     next: (resp) => {
    //       const updated = resp.data;
    //       this.staff.update((list) =>
    //         list.map((item) => (item.id === updated.id ? updated : item)),
    //       );
    //       this.utilService.showToast('info', 'Staff record updated successfully.');
    //     },
    //     error: (err) => {
    //       this.error.set(err);
    //       this.utilService.showToast(
    //         'error',
    //         err.error?.message || 'Unable to update staff invite record.',
    //       );
    //     },
    //   });
  }

  deleteInvite(inviteId: string) {
    this.loading.set(true);

    this.http
      .delete<ApiResponse<void>>(`${environment.api}/identity/staff/invite/${inviteId}`)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: resp => console.log("Deleted Invite:",resp.success),
        error: (err) => {
          this.error.set(err);

          this.utilService.showToast(
            'error',
            err.error.message || 'Something went wrong. Try again!',
          );
        },
      });
  }

  nudgeSuccessful = signal<boolean>(false);
  nudgeInvite(inviteId: string) {
    this.loading.set(true);

    this.http
      .delete<ApiResponse<void>>(`${environment.api}/identity/invite/nudge/${inviteId}`)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: resp => this.nudgeSuccessful.set(true),
        error: (err) => {
          this.error.set(err);

          this.utilService.showToast(
            'error',
            err.error.message || 'Something went wrong. Try again!',
          );
        },
      });
  }
}
