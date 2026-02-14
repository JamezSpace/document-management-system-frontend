import { Injectable, signal } from '@angular/core';
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { firebase_app } from '../../../app.config';
import { AuthUser } from '../../../interfaces/auth/AuthUser.ui';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loading = signal<boolean>(false);
  auth = getAuth(firebase_app);

  getLoading() {
    return this.loading;
  }

  setLoading(isLoading: boolean) {
    this.loading.set(isLoading);
  }

  async login(authUser: AuthUser) {
    try {
    // //   REMOVE! This is only used for local testing
    //     return {
    //     success: 1
    //   };

      const user = await signInWithEmailAndPassword(
        this.auth,
        authUser.email,
        authUser.password
      );

      console.log(user);
      
    //   if (user_credential.user.uid) this.user_type.set(0);

      return {
        success: 1
      };
    } catch (error: any) {
      console.error(error);

      return {
        success: 0,
        reason: error.message,
      };
    }
  }

  async logout() {
    this.auth.signOut();
  }
}
