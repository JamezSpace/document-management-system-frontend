import { Injectable, signal, computed, inject } from '@angular/core';
import {
  getAuth,
  signInWithEmailAndPassword,
  AuthErrorCodes,
  onAuthStateChanged,
  User,
  getIdToken,
} from 'firebase/auth';
import { firebase_app } from '../../../app.config';
import { AuthUser } from '../../../interfaces/auth/AuthUser.ui';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private auth = getAuth(firebase_app);

  // --- Signals for UI State ---
  readonly user = signal<User | null>(null);
  readonly loading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  getLoadingAsASignal() {
    return this.loading;
  }

  setLoading(isLoading: boolean) {
    this.loading.set(isLoading);
  }
  
  constructor() {
    // Keep the 'user' signal in sync with Firebase automatically
    onAuthStateChanged(this.auth, (u) => {
      this.user.set(u);
    });
  }

  /**
   * The "Wait for it" logic for Guards and Interceptors.
   * Resolves with the User object once Firebase is ready.
   */
  async waitForUser(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        unsubscribe(); 
        resolve(user);
      });
    });
  }

  /**
   * Specifically for the Interceptor. 
   * Firebase handles the heavy lifting of refreshing the token if it's expired.
   */
  async getValidToken(): Promise<string | null> {
    const user = await this.waitForUser();
    return user ? await getIdToken(user) : null;
  }

  async login(authUser: AuthUser) {
    this.loading.set(true);
    this.errorMessage.set(null);

    try {
      await signInWithEmailAndPassword(this.auth, authUser.email, authUser.password);
      
      // No need to manually set a token signal; 
      // the Interceptor will call getValidToken() which is more reliable.
      
      this.router.navigateByUrl('/office');
      return { success: 1 };
    } catch (error: any) {
      const friendlyMsg = this.mapFirebaseError(error.code);
      this.errorMessage.set(friendlyMsg);
      return { success: 0, reason: friendlyMsg };
    } finally {
      this.loading.set(false);
    }
  }

  async logout() {
    await this.auth.signOut();
    this.router.navigateByUrl('/login');
  }

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
