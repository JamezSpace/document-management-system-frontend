import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LineLoader } from '../../../components/system-wide/loaders/line-loader/line-loader';
import { OnboardingNavBar } from '../../../components/system-wide/nav-bars/onboarding-nav-bar/onboarding-nav-bar';
import { OnboardingService } from '../../../services/page-wide/onboarding/session/onboarding-service';
import { UtilService } from '../../../services/system-wide/util-service/util-service';
import { StaffService } from '../../../services/page-wide/dashboard/operations/hr/staff/staff-service';

@Component({
  selector: 'nexus-password-reset',
  imports: [LineLoader, OnboardingNavBar, ReactiveFormsModule],
  templateUrl: './password-reset.html',
  styleUrl: './password-reset.css',
})
export class PasswordReset implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private staffService = inject(StaffService);
  onboardingService = inject(OnboardingService);
  utilService = inject(UtilService);

  loading = this.onboardingService.loading;
  currentFrame = signal<number>(1);
  isExiting = signal<boolean>(false);

  oobCode = signal<string>('');
  email = signal<string>('');
  staffId = signal<string>('');
  inviteId = signal<string>('');
  isFirstTimeSetup = signal<boolean>(false);
  staffToOnboard = this.onboardingService.staffToOnboard;

  passwordForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', Validators.required),
  });

  async ngOnInit() {
    const code = this.route.snapshot.queryParams['oobCode'];
    const staffId = this.route.snapshot.queryParams['sid'];
    const inviteId = this.route.snapshot.queryParams['iid'];

    if (!code || !staffId || !inviteId) return;

    this.oobCode.set(code);
    this.staffId.set(staffId);
    this.inviteId.set(inviteId);
    this.isFirstTimeSetup.set(true);

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

    
    if (this.currentFrame() === 3 && this.isFirstTimeSetup() && this.staffId()) {
        // activate staff
        this.staffService.activateNewStaff(this.staffId(), this.inviteId())
    }

    // navigate to login page
    this.router.navigateByUrl('/auth');
    }, 500);
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

    console.log("STATUS:", status);
    
    if (status) this.nextStep();
  }

  goToLogin() {
    this.router.navigateByUrl('/auth');
  }
}
