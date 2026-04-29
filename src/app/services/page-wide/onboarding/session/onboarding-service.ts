import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import {
  confirmPasswordReset,
  getAuth,
  onAuthStateChanged,
  User,
  verifyPasswordResetCode,
} from 'firebase/auth';
import { finalize } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { firebase_app } from '../../../../app.config';
import { ApiResponse } from '../../../../interfaces/api/ApiResponse.interface';
import { ErrorType } from '../../../../interfaces/api/Error.interface';
import { EntityResponse } from '../../../../interfaces/onboarding/Entity.api';
import { OnboardingSession, OnboardingSessionView } from '../../../../interfaces/onboarding/OnboardingSession.api';
import { StaffInvite } from '../../../../interfaces/onboarding/StaffInvite.api';
import { BaseStaffEntity } from '../../../../interfaces/staff/BaseStaff.api';
import { OnboardingSessionStatus } from '../../../../enum/onboarding/sessionStatus.enum';

type PrimaryInformationData = {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  staffId: string;
};

@Injectable({
  providedIn: 'root',
})
export class OnboardingService {
  private auth = getAuth(firebase_app);
  private http = inject(HttpClient);

  loading = signal<boolean>(false);
  error = signal<ErrorType | null>(null);
  entity = signal<EntityResponse<StaffInvite> | null>(null);
  staffToOnboard = signal<BaseStaffEntity | null>(null);
  onboardingSession = signal<OnboardingSession | null>(null);
  onboardingSessions = signal<OnboardingSessionView[]>([]);

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

      return true;
    } catch (error: any) {
      return false;
    }
  }

  async getEntityByToken(token: string) {
    this.loading.set(true);

    this.http
      .get<ApiResponse<EntityResponse<StaffInvite>>>(`${environment.api}/identity/entity/${token}`)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) =>
          this.entity.set({
            type: resp.data.type,
            details: resp.data.details,
          }),
        error: (err) => {
          this.error.set({
            code: {
              httpStatusCode: err.status,
              codeName: err.statusText,
            },
            context: {
              message: err.error.error.message,
              category: null,
            },
          });
        },
      });
  }

  async initOnboardingSession(inviteId: string, email: string) {
    this.loading.set(true);

    this.http
      .post<ApiResponse<OnboardingSession>>(
        `${environment.api}/identity/invite/onboarding/session`,
        {
          inviteId,
          email,
        },
      )
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => this.onboardingSession.set(resp.data),
        error: (err) => this.error.set(err),
      });
  }

  async updateOnboardingSessionData(
    sessionId: string,
    payload?: {
      primaryData: PrimaryInformationData;
      currentStep: number;
    },
  ) {
    this.loading.set(true);

    this.http
      .patch<ApiResponse<OnboardingSession>>(
        `${environment.api}/identity/invite/onboarding/session/${sessionId}`,
        {
          primaryData: payload?.primaryData,
          currentStep: payload?.currentStep,
        },
      )
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => this.onboardingSession.set(resp.data),
        error: (err) => this.error.set(err),
      });
  }

  async uploadOnboardingMedia(
    sessionId: string,
    payload: {
      type: 'profile_picture' | 'signature';
      file: File;
      currentStep: number;
    },
  ) {
    this.loading.set(true);

    const formData = new FormData();
    if (payload.type === 'profile_picture') {
      formData.append('profilePic', payload.file);
    } else {
      formData.append('signatureFile', payload.file);
    }
    formData.append('currentStep', payload.currentStep.toString());

    this.http
      .post<ApiResponse<OnboardingSession>>(
        `${environment.api}/identity/invite/onboarding/session/${sessionId}/media`,
        formData,
      )
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => this.onboardingSession.set(resp.data),
        error: (err) => this.error.set(err),
      });
  }

  async completeOnboardingSession(invitedId: string, sessionId: string, currentStep: number) {
    this.loading.set(true);

    this.http
      .patch<ApiResponse<OnboardingSession>>(
        `${environment.api}/identity/invite/onboarding/session/${sessionId}/completed`,
        { invitedId, currentStep },
      )
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => this.onboardingSession.set(resp.data),
        error: (err) => this.error.set(err),
      });
  }

  async fetchOnboardingSessionByInviteId(inviteId: string) {
    this.loading.set(true);

    this.http
      .get<ApiResponse<OnboardingSession>>(
        `${environment.api}/identity/invite/${inviteId}/onboarding/session`,
      )
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => {
          this.onboardingSession.set(resp.data);
        },
        error: (err) => {
          this.error.set(err);
        },
      });
  }

  async fetchAllCompleteOnboardingSessions() {
    this.loading.set(true);

    this.http
      .get<ApiResponse<OnboardingSessionView[]>>(`${environment.api}/identity/invites/onboarding/sessions`)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => {
          const sessions = resp.data;

          this.onboardingSessions.set(
            sessions.filter((session) => session.status === OnboardingSessionStatus.COMPLETED),
          );
        },
        error: (err) => {
          this.error.set(err);
        },
      });
  }
}
