import { Injectable, signal, inject } from '@angular/core';
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User,
  getIdToken,
} from 'firebase/auth';
import { firebase_app } from '../../../app.config';
import { Router } from '@angular/router';
import { UtilService } from '../../../shared/utils/service/util-service';
import { AuthUser } from '../../../models/ui/auth/AuthUser.ui';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private auth = getAuth(firebase_app);
  private utilService = inject(UtilService);

  //  for Ui State
  readonly user = signal<User | null>(null);
  readonly errorMessage = signal<string | null>(null);
  /** Database identity/office bootstrap, shown by the application splash screen. */
  readonly secureEnvironmentLoading = signal<boolean>(false);
  loading = signal<boolean>(false);

  isSecureEnvironmentLoading() {
    return this.secureEnvironmentLoading;
  }

  beginSecureEnvironmentSetup(): void {
    this.secureEnvironmentLoading.set(true);
  }

  endSecureEnvironmentSetup(): void {
    this.secureEnvironmentLoading.set(false);
  }

  constructor() {
    // keep the 'user' signal in sync with Firebase automatically
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

      // Firebase has finished. Hand loading ownership over to the database
      // identity/bootstrap phase before routing into the protected office tree.
      this.loading.set(false);
      this.beginSecureEnvironmentSetup();

      return { success: 1 };
    } catch (error: any) {
      const friendlyMsg = this.utilService.mapFirebaseError(error.code);

      this.errorMessage.set(friendlyMsg);
      this.loading.set(false);

      return { success: 0, reason: friendlyMsg };
    }
  }

  async logout() {
    await this.auth.signOut();

    this.router.navigateByUrl('/auth');

    this.resetContext();
  }

  resetContext() {
    this.loading.set(false);
    this.endSecureEnvironmentSetup();
    this.errorMessage.set(null);
  }
}
