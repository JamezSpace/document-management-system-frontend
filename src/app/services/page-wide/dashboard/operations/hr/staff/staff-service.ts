import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { environment } from '../../../../../../../environments/environment.development';
import { ApiResponse } from '../../../../../../interfaces/api/ApiResponse.interface';
import { ErrorType } from '../../../../../../interfaces/api/Error.interface';
import { DesignationApi } from '../../../../../../interfaces/org units/designation.api';
import { OfficeApi } from '../../../../../../interfaces/org units/offices.api';
import { InitStaffPayload, InviteStaffPayload } from '../../../../../../interfaces/staff/InitStaff.api';
import { StaffWithMedia } from '../../../../../../interfaces/staff/StaffWithMedia.api';
import { UtilService } from '../../../../../system-wide/util-service/util-service';
import { StaffDetailsService } from '../../../office-template/staff-details-service';

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  private http = inject(HttpClient);
  private utilService = inject(UtilService);
  private staffDetailsService = inject(StaffDetailsService);
  private router = inject(Router);

  initStaff = signal<InitStaffPayload | null>(null);
  staff = signal<StaffWithMedia[]>([]);
  officesInUnit = signal<OfficeApi[]>([]);
  officeDesignations = signal<DesignationApi[]>([]);
  loading = signal<boolean>(false);
  error = signal<ErrorType | null>(null);

  readonly loggedInStaff = this.staffDetailsService.data()!;

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

  fetchAllOffices() {
    this.loading.set(true);

    this.http
      .get<ApiResponse<OfficeApi[]>>(
        `${environment.api}/identity/${this.loggedInStaff.unit.id}/offices`,
      )
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => this.officesInUnit.set(resp.data),
        error: (err) => this.error.set(err),
      });
  }

  fetchAllDesignations() {
    this.loading.set(true);

    this.http
      .get<ApiResponse<DesignationApi[]>>(`${environment.api}/identity/office/designations`)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => this.officeDesignations.set(resp.data),
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
        error: (err) => {
          this.error.set(err);

          console.log(err);

          this.utilService.showToast(
            'error',
            err.error.message || 'Something went wrong. Try again!',
          );
        },
      });
  }

  activateStaff(staffId: string) {
    this.loading.set(true);

    // TODO: replace placeholder URL when endpoint is finalized
    this.http
      .post<ApiResponse<void>>(`${environment.api}/identity/staff/${staffId}/activate`, {})
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.utilService.showToast('info', 'Staff account activated successfully.');
        },
        error: (err) => {
          this.error.set(err);
          this.utilService.showToast(
            'error',
            err.error?.message || 'Unable to activate staff account.',
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
        `${environment.api}/identity/staff/${staffId}/update`,
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
        error: (err) => {
          this.error.set(err);
          this.utilService.showToast(
            'error',
            err.error?.message || 'Unable to update staff record.',
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
        error: (err) => {
          this.error.set(err);
          this.utilService.showToast(
            'error',
            err.error?.message || 'Unable to delete staff record.',
          );
        },
      });
  }
}
