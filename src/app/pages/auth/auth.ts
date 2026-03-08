import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AuthService } from '../../services/page-wide/auth/auth-service';
import { lucideMail, lucideLockKeyhole, lucideEye, lucideEyeOff } from '@ng-icons/lucide';
import { provideIcons, NgIcon } from '@ng-icons/core';
import { ErrorToast } from '../../components/system-wide/toast/error-toast/error-toast';
import { LineLoader } from "../../components/system-wide/loaders/line-loader/line-loader";

@Component({
  selector: 'nexus-auth',
  imports: [
    ReactiveFormsModule,
    HlmInputGroupImports,
    HlmSpinnerImports,
    NgIcon,
    LineLoader
],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
  providers: [
    provideIcons({
      lucideMail,
      lucideLockKeyhole,
      lucideEye,
      lucideEyeOff,
    }),
  ],
})
export class Auth {
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  loadingFromAuthService = this.authService.loading;
  passwordRevealed = signal<boolean>(false);
  togglePasswordFieldType() {
    this.passwordRevealed.set(!this.passwordRevealed());
  }

  get currentYear(): number {
    return new Date().getFullYear();
  }

  authFormGroup = new FormGroup({
    email: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    password: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
  });

  async submitData() {
    // this triggers the dashboard setup loader, should only be used when user is about entering dashboard
    this.authService.setLoading(true);

    // login
    const response = await this.authService.login({
      email: this.authFormGroup.getRawValue().email,
      password: this.authFormGroup.getRawValue().password,
    });

    if (!response.success) this.showToast(response.reason!);
  }

  showToast(errorMsg: string) {
    this.snackBar.openFromComponent(ErrorToast, {
      duration: 5000,
      data: {
        errorMessage : errorMsg
      },
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }
}
