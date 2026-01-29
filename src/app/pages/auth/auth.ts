import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'nexus-auth',
  imports: [ReactiveFormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
    hasRequestBeenSent = signal<boolean>(false)

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

    
}
