import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { lucideMail, lucideLockKeyhole, lucideEye, lucideEyeOff } from '@ng-icons/lucide';
import { provideIcons, NgIcon } from '@ng-icons/core';
import { LineLoader } from '../../../shared/components/loaders/line-loader/line-loader';
import { UtilService } from '../../../shared/utils/service/util-service';
import { AuthService } from '../service/auth-service';


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
  private utilService = inject(UtilService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

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

  async submitData(): Promise<void> {
    if (this.authFormGroup.invalid || this.loadingFromAuthService()) return;

    // login
    const response = await this.authService.login({
      email: this.authFormGroup.getRawValue().email,
      password: this.authFormGroup.getRawValue().password,
    });

    if (!response.success) {
      this.utilService.showToast('error', response.reason!);
      return;
    }

    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    const destination = returnUrl?.startsWith('/') && !returnUrl.startsWith('//')
      ? returnUrl
      : '/office';

    await this.router.navigateByUrl(destination);
  }
}
