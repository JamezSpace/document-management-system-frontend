import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/page-wide/auth/auth-service';

@Component({
  selector: 'nexus-auth',
  imports: [ReactiveFormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
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
