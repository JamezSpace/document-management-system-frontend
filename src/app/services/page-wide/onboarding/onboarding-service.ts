import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import {
  EntityRequest,
  EntityResponse,
  EntityType,
} from '../../../interfaces/onboarding/entities/Entity.api';
import { confirmPasswordReset, getAuth, onAuthStateChanged, User, verifyPasswordResetCode } from 'firebase/auth';
import { firebase_app } from '../../../app.config';
import { ApiResponse } from '../../../interfaces/shared/ApiResponse.interface';
import { BaseStaffEntity } from '../../../interfaces/users/office/staff/BaseStaff.api';
import { finalize } from 'rxjs';
import { ErrorType } from '../../../interfaces/shared/Error.interface';

@Injectable({
  providedIn: 'root',
})
export class OnboardingService {
  private auth = getAuth(firebase_app);
  private http = inject(HttpClient);

  loading = signal<boolean>(false);
  error = signal<ErrorType | null>(null);
  entity = signal<EntityResponse | null>(null);
  staffToOnboard = signal<BaseStaffEntity | null>(null)

  // creates a writable signal for the user
  private _currentUser = signal<User | null>(null);

  // convert to a read-only signal
  currentUser = this._currentUser.asReadonly();

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this._currentUser.set(user);
    });
  }

  hasPasswordSet = computed(() => {
    const user = this.currentUser();
    if (!user) return false;

    return user.providerData.some((p) => p.providerId === 'password');
  });

  async verifyPasswordResetLink(oobCode: string) {
    const emailExtracted = await verifyPasswordResetCode(this.auth, oobCode);

    return emailExtracted;
  }

  async setPasswordForFirstTimeUser(oobCode: string, password: string) {
    this.loading.set(true);

    try {
        await confirmPasswordReset(this.auth, oobCode, password);

        return true
    } catch (error: any) {
        return false
    }
  }

    async getEntityDetails(entity: EntityRequest) {
    this.loading.set(true);

    this.http
      .get<ApiResponse<BaseStaffEntity>>(`${environment.api}/identity/staff/${entity.id}`)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) =>
          this.entity.set({
            type: EntityType.STAFF,
            details: resp.data,
          }),
        error: (err) => this.error.set(err),
      });
  }


  async fetchStaffUsingAuthProviderId() {
    this.loading.set(true);

    this.http
      .get<ApiResponse<BaseStaffEntity>>(`${environment.api}/identity/staff/provider/${this.currentUser()?.providerId}`)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) =>
          this.entity.set({
            type: EntityType.STAFF,
            details: resp.data,
          }),
        error: (err) => this.error.set(err),
      });
  }
}
