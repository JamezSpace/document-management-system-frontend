import { Injectable, signal, computed } from '@angular/core';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { firebase_app } from '../../../app.config';
import { AuthUser } from '../../../interfaces/auth/AuthUser.ui';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = getAuth(firebase_app);
  
  // Signals for state
  loading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  getLoading() {
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
        authUser.password
      );
      
      console.log(userCredential);
      
      this.loading.set(false);
      return { success: 1, user: userCredential.user };

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
      case 'auth/invalid-credential':
        return 'Incorrect email or password.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }
}