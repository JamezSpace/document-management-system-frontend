import { Injectable, signal } from '@angular/core';
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';

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

  async logout() {
    this.auth.signOut();
  }
}
