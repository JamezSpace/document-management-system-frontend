import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loading = signal<boolean>(false);

  getLoading() {
    return this.loading;
  }

  setLoading(isLoading: boolean) {
    this.loading.set(isLoading);
  }

}
