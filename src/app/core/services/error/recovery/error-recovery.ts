import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorRecovery } from '../../../../enums/global/errorRecovery.enum';

@Injectable({ providedIn: 'root' })
export class ErrorRecoveryService {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);

  recover(recovery: ErrorRecovery): void {
    switch (recovery) {
      case ErrorRecovery.RELOAD:
      case ErrorRecovery.RETRY:
        this.document.defaultView?.location.reload();
        return;
      case ErrorRecovery.GO_BACK:
        this.document.defaultView?.history.back();
        return;
      case ErrorRecovery.SIGN_IN:
        void this.router.navigateByUrl('/auth');
        return;
      case ErrorRecovery.REQUEST_ACCESS:
      case ErrorRecovery.CONTACT_SUPPORT:
      case ErrorRecovery.NONE:
        return;
    }
  }
}
