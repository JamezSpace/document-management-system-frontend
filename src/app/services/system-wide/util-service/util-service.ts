import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs';
import { ErrorToast } from '../../../components/system-wide/toast/error-toast/error-toast';
import { NotifToast } from '../../../components/system-wide/toast/notif-toast/notif-toast';
import { AuthErrorCodes } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  private snackBar = inject(MatSnackBar);
  private breakpointObserver = inject(BreakpointObserver);

  // a signal that is true when we are on a small screen (e.g., Handset)
  isMobile = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.Handset, '(max-width: 768px)'])
      .pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  showToast(type: 'error' | 'info', message: string) {
    if (type === 'error')
      this.snackBar.openFromComponent(ErrorToast, {
        duration: 5000,
        data: {
          errorMessage: message,
        },
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      });
    else
      this.snackBar.openFromComponent(NotifToast, {
        duration: 5000,
        data: {
          message: message,
        },
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      });
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
