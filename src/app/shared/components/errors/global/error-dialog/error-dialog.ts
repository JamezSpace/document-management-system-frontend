import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTriangleAlert } from '@ng-icons/lucide';
import { ErrorRecovery } from '../../../../../enums/global/errorRecovery.enum';
import type { AppError } from '../../../../../models/ui/global/ErrorPresentation.ui';

@Component({
  selector: 'nexus-error-dialog',
  imports: [MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, NgIcon],
  templateUrl: './error-dialog.html',
  styleUrl: './error-dialog.css',
  providers: [provideIcons({ lucideTriangleAlert })],
})
export class ErrorDialog {
  readonly ErrorRecovery = ErrorRecovery;
  constructor(@Inject(MAT_DIALOG_DATA) readonly error: AppError) {}
}
