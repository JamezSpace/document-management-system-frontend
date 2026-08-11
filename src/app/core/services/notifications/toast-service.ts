import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorToast } from '../../../shared/components/toasts/error-toast/error-toast';
import { NotifToast } from '../../../shared/components/toasts/notif-toast/notif-toast';
import { ToastType } from '../../../enums/toast/toastType.enum';


@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly snackBar = inject(MatSnackBar);

  show(type: ToastType, message: string): void {
    if (type === ToastType.ERROR) {
      this.snackBar.openFromComponent(ErrorToast, {
        duration: 5000,
        data: {
          message,
        },
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      });

      return;
    }

    this.snackBar.openFromComponent(NotifToast, {
      duration: 5000,
      data: {
        message,
        type,
      },
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }

  success(message: string): void {
    this.show(ToastType.SUCCESS, message);
  }

  info(message: string): void {
    this.show(ToastType.INFO, message);
  }

  error(message: string): void {
    this.show(ToastType.ERROR, message);
  }
}