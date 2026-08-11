import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { ErrorRecovery } from '../../../../enums/global/errorRecovery.enum';
import type { AppError } from '../../../../models/ui/global/ErrorPresentation.ui';
import { ErrorDialog } from '../../../../shared/components/errors/global/error-dialog/error-dialog';
import { ErrorRecoveryService } from '../recovery/error-recovery';

@Injectable({ providedIn: 'root' })
export class ErrorDialogService {
  private readonly dialog = inject(MatDialog);
  private readonly recoveryService = inject(ErrorRecoveryService);

  open(error: AppError): void {
    this.dialog
      .open<ErrorDialog, AppError, ErrorRecovery | undefined>(ErrorDialog, {
        data: error,
        disableClose: true,
        maxWidth: '92vw',
      })
      .afterClosed()
      .pipe(filter((recovery): recovery is ErrorRecovery => recovery !== undefined))
      .subscribe((recovery) => this.recoveryService.recover(recovery));
  }
}
