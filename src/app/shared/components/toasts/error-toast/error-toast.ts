import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarLabel } from '@angular/material/snack-bar';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideAlertOctagon } from '@ng-icons/lucide';

@Component({
  selector: 'nexus-error-toast',
  imports: [NgIcon, MatSnackBarLabel],
  templateUrl: './error-toast.html',
  styleUrl: './error-toast.css',
  providers: [
    provideIcons({
      lucideAlertOctagon
    }),
  ]
})
export class ErrorToast {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public data: {errorMessage: string},
  ) {}
}
