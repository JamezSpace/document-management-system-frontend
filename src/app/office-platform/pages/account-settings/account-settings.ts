import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBell,
  lucideCamera,
  lucideCheck,
  lucideCircleAlert,
  lucideFileClock,
  lucideFingerprint,
  lucideHistory,
  lucideKeyRound,
  lucideLaptop,
  lucideRefreshCw,
  lucideSave,
  lucideShieldCheck,
  lucideUpload,
} from '@ng-icons/lucide';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCheckbox } from '@spartan-ng/helm/checkbox';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmTextarea } from '@spartan-ng/helm/textarea';
import type {
  GovernedProfileField,
  IdentityProfileDto,
} from '../../../api/identity/identity-self-service.contracts';
import { ToastService } from '../../../core/services/notifications/toast-service';
import { OfficeContextService } from '../../context/office-context.service';
import { IdentitySelfService } from './identity-self-service.service';

@Component({
  selector: 'nexus-account-settings',
  imports: [
    NgIcon,
    MatTabsModule,
    HlmBreadCrumbImports,
    HlmButtonImports,
    HlmCardImports,
    HlmCheckbox,
    HlmInput,
    HlmSeparator,
    HlmTextarea,
    ReactiveFormsModule,
  ],
  templateUrl: './account-settings.html',
  providers: [
    provideIcons({
      lucideBell,
      lucideCamera,
      lucideCheck,
      lucideCircleAlert,
      lucideFileClock,
      lucideFingerprint,
      lucideHistory,
      lucideKeyRound,
      lucideLaptop,
      lucideRefreshCw,
      lucideSave,
      lucideShieldCheck,
      lucideUpload,
    }),
    IdentitySelfService,
  ],
})
class AccountSettings implements OnInit {
  readonly officeContext = inject(OfficeContextService);
  readonly identityService = inject(IdentitySelfService);
  private readonly toast = inject(ToastService);

  readonly profilePictureError = signal<string | null>(null);
  readonly requestError = signal<string | null>(null);
  readonly evidenceFiles = signal<File[]>([]);
  readonly signatureFile = signal<File | null>(null);
  readonly governanceFields: GovernedProfileField[] = [
    'firstName',
    'middleName',
    'lastName',
    'email',
    'phoneNumber',
    'profilePicture',
    'signature',
  ];

  readonly phoneForm = new FormGroup({
    phoneNumber: new FormControl('', {
      nonNullable: true,
      validators: [Validators.pattern(/^\+[1-9]\d{7,14}$/)],
    }),
  });

  readonly governedForm = new FormGroup({
    firstName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    middleName: new FormControl('', { nonNullable: true }),
    lastName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    reason: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
    }),
  });

  async ngOnInit(): Promise<void> {
    await this.reload();
  }

  async reload(): Promise<void> {
    try {
      await this.identityService.load();
      this.resetForms(this.identityService.profile());
    } catch {
      // The service exposes a page-level error and the global interceptor records presentation.
    }
  }

  canDirect(field: GovernedProfileField): boolean {
    return this.identityService.governanceFor(field)?.mode === 'direct';
  }

  canRequest(field: GovernedProfileField): boolean {
    return this.identityService.governanceFor(field)?.mode === 'approval_required';
  }

  governanceReason(field: GovernedProfileField): string {
    const decision = this.identityService.governanceFor(field);
    return decision?.reasonCode.replaceAll('_', ' ') ?? 'No active field decision';
  }

  async savePhone(): Promise<void> {
    if (this.phoneForm.invalid || this.identityService.saving()) return;
    try {
      const value = this.phoneForm.getRawValue().phoneNumber.trim();
      await this.identityService.updatePhone(value || null);
      this.resetForms(this.identityService.profile());
      this.toast.success('Phone number updated.');
    } catch {
      // Normalized API errors are presented globally and retained by the service.
    }
  }

  async selectProfilePicture(event: Event): Promise<void> {
    this.profilePictureError.set(null);
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    const accepted = new Set(['image/jpeg', 'image/png', 'image/webp']);
    if (!accepted.has(file.type)) {
      this.profilePictureError.set('Choose a JPEG, PNG or WebP image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.profilePictureError.set('The profile picture must not exceed 5 MiB.');
      return;
    }

    try {
      await this.identityService.updateProfilePicture(file);
      this.toast.success('Profile picture updated.');
    } catch {
      // Normalized API errors are presented globally and retained by the service.
    }
  }

  selectEvidence(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = '';
    const accepted = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);
    const invalid = files.find((file) => !accepted.has(file.type));
    if (invalid) {
      this.requestError.set('Evidence must be a JPEG, PNG, WebP or PDF file.');
      return;
    }
    this.requestError.set(null);
    this.evidenceFiles.set(files);
  }

  selectSignature(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    input.value = '';
    if (file && file.type !== 'image/svg+xml') {
      this.requestError.set('The replacement signature must be an SVG file.');
      return;
    }
    this.requestError.set(null);
    this.signatureFile.set(file);
  }

  async submitChangeRequest(): Promise<void> {
    this.requestError.set(null);
    const changes = this.changedGovernedFields();
    const signature = this.canRequest('signature') ? this.signatureFile() : null;
    if (signature && this.canRequest('signature')) changes.signature = '';

    if (this.governedForm.invalid) {
      this.governedForm.markAllAsTouched();
      this.requestError.set('Provide valid changes and a reason of at least 10 characters.');
      return;
    }
    if (Object.keys(changes).length === 0) {
      this.requestError.set('Change at least one approval-controlled field.');
      return;
    }
    if (this.requiresEvidence(changes) && this.evidenceFiles().length === 0) {
      this.requestError.set('Supporting evidence is required for the selected changes.');
      return;
    }

    // The service replaces this marker with the owned media ID returned by the upload endpoint.
    if (changes.signature === '') delete changes.signature;

    try {
      await this.identityService.submitGovernedChange({
        changes,
        reason: this.governedForm.getRawValue().reason.trim(),
        evidence: this.evidenceFiles(),
        signature,
      });
      this.evidenceFiles.set([]);
      this.signatureFile.set(null);
      this.resetForms(this.identityService.profile());
      this.toast.success('Identity change request submitted for approval.');
    } catch {
      // Normalized API errors are presented globally and retained by the service.
    }
  }

  formatDate(value: string | null | undefined): string {
    if (!value) return 'Not available';
    return new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium', timeStyle: 'short' }).format(
      new Date(value),
    );
  }

  changeLabels(changes: Partial<Record<GovernedProfileField, unknown>>): string {
    return Object.keys(changes)
      .map((field) => field.replace(/([A-Z])/g, ' $1').toLowerCase())
      .join(', ');
  }

  private changedGovernedFields() {
    const profile = this.identityService.profile();
    const form = this.governedForm.getRawValue();
    const changes: Partial<
      Record<'firstName' | 'middleName' | 'lastName' | 'email' | 'signature', string | null>
    > = {};
    if (!profile) return changes;

    for (const field of ['firstName', 'lastName', 'email'] as const) {
      const value = form[field].trim();
      if (this.canRequest(field) && value !== profile[field]) changes[field] = value;
    }
    const middleName = form.middleName.trim() || null;
    if (this.canRequest('middleName') && middleName !== profile.middleName) {
      changes.middleName = middleName;
    }
    return changes;
  }

  private requiresEvidence(changes: Partial<Record<GovernedProfileField, unknown>>): boolean {
    const fields = Object.keys(changes) as GovernedProfileField[];
    if (this.signatureFile()) fields.push('signature');
    return fields.some((field) =>
      this.identityService.governanceFor(field)?.requirements.includes('supporting_evidence'),
    );
  }

  private resetForms(profile: IdentityProfileDto | null): void {
    if (!profile) return;
    this.phoneForm.reset({ phoneNumber: profile.phoneNumber ?? '' });
    this.governedForm.reset({
      firstName: profile.firstName,
      middleName: profile.middleName ?? '',
      lastName: profile.lastName,
      email: profile.email,
      reason: '',
    });
  }
}

export { AccountSettings };
