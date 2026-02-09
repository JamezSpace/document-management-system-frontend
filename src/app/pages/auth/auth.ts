import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { AuthService } from '../../services/page-wide/auth/auth-service';
import { lucideMail, lucideLockKeyhole, lucideEye, lucideEyeOff } from '@ng-icons/lucide';
import { provideIcons, NgIcon } from '@ng-icons/core';


@Component({
  selector: 'nexus-auth',
  imports: [ReactiveFormsModule, HlmInputGroupImports, NgIcon],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
  providers: [
    provideIcons({
        lucideMail, lucideLockKeyhole, lucideEye, lucideEyeOff
    })
  ]
})
export class Auth {
    private authService = inject(AuthService);

    passwordRevealed = signal<boolean>(false)
    togglePasswordFieldType() {
        this.passwordRevealed.set(!this.passwordRevealed())
    }

    get currentYear(): number {
        return new Date().getFullYear();
    }

    authFormGroup = new FormGroup({
        email: new FormControl<string>('', Validators.required),
        password: new FormControl<string>('', Validators.required),
    })

    submitData() {
        // this triggers the dashboard setup loader, should only be used when user is about entering dashboard
        this.authService.setLoading(true);
    }
}
