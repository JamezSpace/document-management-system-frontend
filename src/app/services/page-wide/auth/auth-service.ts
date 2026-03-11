import { Injectable, signal, computed, inject } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, AuthErrorCodes } from 'firebase/auth';
import { firebase_app } from '../../../app.config';
import { AuthUser } from '../../../interfaces/auth/AuthUser.ui';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private auth = getAuth(firebase_app);

  // Signals for state
  loading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  accessToken = signal<string>('');

  getLoadingAsASignal() {
    return this.loading;
  }

  setLoading(isLoading: boolean) {
    this.loading.set(isLoading);
  }

  async login(authUser: AuthUser) {
    this.loading.set(true);
    this.errorMessage.set(null); // Reset previous errors

    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        authUser.email,
        authUser.password,
      );

      const accessToken = await userCredential.user.getIdToken();
      this.accessToken.set(accessToken);

      this.loading.set(false);

      this.router.navigateByUrl('/office')

      return { success: 1 };
    } catch (error: any) {
      this.loading.set(false);

      // Handle the error via a helper method
      const friendlyMsg = this.mapFirebaseError(error.code);
      this.errorMessage.set(friendlyMsg);

      return { success: 0, reason: friendlyMsg };
    }
  }

  // A "Pseudo-Interceptor" for Firebase errors
  private mapFirebaseError(code: string): string {
    switch (code) {
      case AuthErrorCodes.INVALID_LOGIN_CREDENTIALS:
        return 'Incorrect email or password.';
      case AuthErrorCodes.USER_DISABLED:
        return 'This account has been disabled.';
      case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
        return 'Too many attempts. Try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }
}
