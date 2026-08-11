import { map } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthErrorCodes } from 'firebase/auth';
import { ToastService } from '../../../core/services/notifications/toast-service';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  private readonly toastService = inject(ToastService);
  private breakpointObserver = inject(BreakpointObserver);

  // a signal that is true when we are on a small screen (e.g., Handset)
  isMobile = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.Handset, '(max-width: 768px)'])
      .pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  showToast(type: 'error' | 'info', message: string): void {
    if (type === 'error') {
      this.toastService.error(message);
      return;
    }

    this.toastService.info(message);
  }

  formatDateAsReadableString(dateString: string | Date | null) {
    if (!dateString) return '';

    const date = new Date(dateString);

    return date.toLocaleString();
  }

  mapFirebaseError(code: string): string {
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
