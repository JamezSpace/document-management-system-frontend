import { inject, Injectable } from '@angular/core';
import { AppError } from '../../../../models/ui/global/ErrorPresentation.ui';
import { ToastService } from '../../notifications/toast-service';
import { ErrorSurface } from '../../../../enums/global/errorSurface.enum';
import { ErrorBannerService } from '../banner/error-banner';
import { ErrorDialogService } from '../dialog/error-dialog';

@Injectable({
  providedIn: 'root',
})
export class ErrorPresenterService {
  private readonly toastService = inject(ToastService);
  private readonly bannerService = inject(ErrorBannerService);
  private readonly dialogService = inject(ErrorDialogService);

  present(error: AppError): void {
    switch (error.surface) {
      case ErrorSurface.TOAST:
        this.toastService.error(error.message);
        return;

      case ErrorSurface.BANNER:
        this.bannerService.show(error);
        return;

      case ErrorSurface.MODAL:
        this.dialogService.open(error);
        return;

      case ErrorSurface.SILENT:
      case ErrorSurface.INLINE:
      case ErrorSurface.COMPONENT:
      case ErrorSurface.PAGE:
        return;
    }
  }
}
