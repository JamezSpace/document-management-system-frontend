import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LineLoader } from '../../../components/system-wide/loaders/line-loader/line-loader';
import { OnboardingNavBar } from '../../../components/system-wide/nav-bars/onboarding-nav-bar/onboarding-nav-bar';
import { OnboardingService } from '../../../services/page-wide/onboarding/onboarding-service';
import { UtilService } from '../../../services/system-wide/util-service/util-service';

@Component({
  selector: 'nexus-password-reset',
  imports: [LineLoader, OnboardingNavBar, ReactiveFormsModule],
  templateUrl: './password-reset.html',
  styleUrl: './password-reset.css',
})
export class PasswordReset implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  onboardingService = inject(OnboardingService);
  utilService = inject(UtilService);

  loading = this.onboardingService.loading;
  currentFrame = signal<number>(1);
  isExiting = signal<boolean>(false);

  oobCode = signal<string>('');
  email = signal<string>('');
  staffId = signal<string>('');
  isFirstTimeSetup = signal<boolean>(false);
  staffToOnboard = this.onboardingService.staffToOnboard;

  passwordForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', Validators.required),
  });

  async ngOnInit() {
    const code = this.route.snapshot.queryParams['oobCode'];
    const staffId = this.route.snapshot.queryParams['id'];

    if (!code || !staffId) return;
    this.oobCode.set(code);
    this.staffId.set(staffId);
    this.isFirstTimeSetup.set(true)

    // verify firebase reset link
    const email = await this.onboardingService.verifyPasswordResetLink(code);

    this.email.set(email);

    const userHasPasswordSet = this.onboardingService.hasPasswordSet();

    if (!userHasPasswordSet) this.currentFrame.set(2);
  }

  nextStep() {
    this.loading.set(true);
    this.isExiting.set(true);

    setTimeout(() => {
      this.currentFrame.update((n) => n + 1);
      this.isExiting.set(false);
      this.loading.set(false);
    }, 500);

    if (this.currentFrame() === 3 && this.isFirstTimeSetup() && this.staffId())
      this.router.navigateByUrl(`staff/onboarding/${this.staffId()}`);
    else this.router.navigateByUrl('/auth');
  }

  async submitPassword() {
    const password = this.passwordForm.controls.password.value;
    const confirmPassword = this.passwordForm.controls.confirmPassword.value;

    if (!password || !confirmPassword) return;

    if (password !== confirmPassword) {
      this.utilService.showToast('info', 'Passwords do not match');

      return;
    }

    const status = await this.onboardingService.setPasswordForFirstTimeUser(
      this.oobCode(),
      password,
    );

    if (status) this.nextStep();
  }

  goToLogin() {
    this.router.navigateByUrl('/auth');
  }
}
