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
import { OnboardingSessionStatus } from '../../../../enum/onboarding/sessionStatus.enum';
import { ApiResponse } from '../../../../interfaces/api/ApiResponse.interface';
import { ErrorType } from '../../../../interfaces/api/Error.interface';
import { EntityResponse } from '../../../../interfaces/onboarding/Entity.api';
import {
    OnboardingSession
} from '../../../../interfaces/onboarding/OnboardingSession.api';
import { StaffInvite } from '../../../../interfaces/onboarding/StaffInvite.api';
import { BaseStaffEntity } from '../../../../interfaces/staff/BaseStaff.api';
import { UtilService } from '../../../system-wide/util-service/util-service';

type PrimaryInformationData = {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phoneNumber: string;
  staffId: string;
};

@Injectable({
  providedIn: 'root',
})
export class OnboardingService {
    private http = inject(HttpClient);
  private auth = getAuth(firebase_app);
  private utilService = inject(UtilService);

  loading = signal<boolean>(false);
  error = signal<ErrorType | null>(null);
  entity = signal<EntityResponse<StaffInvite> | null>(null);
  staffToOnboard = signal<BaseStaffEntity | null>(null);
  onboardingSession = signal<OnboardingSession | null>(null);
  onboardingSessions = signal<OnboardingSession[]>([]);

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

        if(error.code === 'auth/password-does-not-meet-requirements')
            this.utilService.showToast('error', 'Password does not meet requirements')

        this.loading.set(false)
        
      return false;
    }
  }

  extractEntityDetailsFromLocalStrorage() {
    let data = localStorage.getItem('entity');

    let entity = data ? (JSON.parse(data) as EntityResponse<StaffInvite>) : null;
    let healthy: boolean = false;

    if (entity && entity.type && entity.details) healthy = true;

    return {
      entity,
      healthy,
    };
  }

  clearEntityDetailsFromLocalStorage() {
    localStorage.removeItem('entity');
  }

  async getEntityByToken(token: string) {
    this.loading.set(true);

    const { entity, healthy: isEntityHealthy } = this.extractEntityDetailsFromLocalStrorage();

    if (isEntityHealthy && entity?.details.token === token) {
      this.entity.set(entity);
      return;
    }

    this.http
      .get<ApiResponse<EntityResponse<StaffInvite>>>(`${environment.api}/identity/entity/${token}`)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => {
          let data = {
            type: resp.data.type,
            details: resp.data.details,
          };

          this.entity.set(data);

          localStorage.setItem('entity', JSON.stringify(data));
        },
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
        next: (resp) =>
            this.onboardingSession.update((current) =>
                current ? { ...current, ...resp.data } : resp.data,
        ),
        error: (err) => this.error.set(err),
      });
  }

  async completeOnboardingSession(inviteId: string, sessionId: string) {
    this.loading.set(true);

    this.http
      .patch<ApiResponse<OnboardingSession>>(
        `${environment.api}/identity/invite/onboarding/session/${sessionId}/completed`,
        { inviteId },
      )
      .pipe(
        finalize(() => {
          this.loading.set(false);
          this.clearEntityDetailsFromLocalStorage();
        }),
      )
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
      .get<ApiResponse<OnboardingSession[]>>(
        `${environment.api}/identity/invites/onboarding/sessions`,
      )
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
