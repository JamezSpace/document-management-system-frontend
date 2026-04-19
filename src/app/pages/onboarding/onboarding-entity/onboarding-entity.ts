import { Component, computed, effect, inject, Input, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepper, MatStep } from '@angular/material/stepper';
import { OnboardingService } from '../../../services/page-wide/onboarding/onboarding-service';
import { UtilService } from '../../../services/system-wide/util-service/util-service';
import { LineLoader } from '../../../components/system-wide/loaders/line-loader/line-loader';
import { OnboardingNavBar } from '../../../components/system-wide/nav-bars/onboarding-nav-bar/onboarding-nav-bar';
import { IdCard } from '../../../components/dashboard-wide/id-card/id-card';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityType } from '../../../interfaces/onboarding/Entity.api';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideUser,
  lucideUserRound,
  lucideContact,
  lucideIdCard,
  lucideMail,
  lucideBadgeCheck,
  lucideHistory,
  lucideShieldCheck,
} from '@ng-icons/lucide';
import { SpartanH1 } from '../../../components/system-wide/typography/spartan-h1/spartan-h1';
import { SpartanP } from '../../../components/system-wide/typography/spartan-p/spartan-p';
import { SpartanH3 } from "../../../components/system-wide/typography/spartan-h3/spartan-h3";

type PrimaryInformationData = {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  staffId: string;
};

@Component({
  selector: 'nexus-onboarding-entity',
  imports: [
    LineLoader,
    OnboardingNavBar,
    IdCard,
    MatStepper,
    MatStep,
    ReactiveFormsModule,
    MatTooltip,
    NgIcon,
    SpartanH1,
    SpartanP,
    SpartanH3
],
  templateUrl: './onboarding-entity.html',
  styleUrl: './onboarding-entity.css',
  providers: [
    provideIcons({
      lucideUser,
      lucideUserRound,
      lucideContact,
      lucideIdCard,
      lucideMail,
      lucideBadgeCheck,
      lucideHistory,
      lucideShieldCheck,
    }),
  ],
})
export class OnboardingEntity {
  // used to create custom or different onboarding pages for different entities
  @Input() entityType!: EntityType;

  private onboardingService = inject(OnboardingService);
  private utilService = inject(UtilService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  entity = this.onboardingService.entity;
  errorFetchingEntity = this.onboardingService.error;

  private sessionSyncDone = signal<boolean>(false);
  private syncFromEntityEffect = effect(() => {
    const entity = this.onboardingService.entity();

    if (!entity || this.sessionSyncDone()) return;

    const inviteId = entity.details.id;
    if (!inviteId) return;

    const session = this.onboardingService.onboardingSession();
    if (!session) {
      this.onboardingService.fetchOnboardingSessionByInviteId(inviteId);
      return;
    }

    const primaryData =
      typeof session.primary_data === 'object' && session.primary_data !== null
        ? (session.primary_data as Partial<PrimaryInformationData>)
        : {};

    this.primaryInformationFormGroup.patchValue({
      firstName: primaryData.firstName ?? '',
      lastName: primaryData.lastName ?? '',
      middleName: primaryData.middleName ?? '',
      email: primaryData.email ?? session.email ?? '',
      staffId: primaryData.staffId ?? '',
    });

    const step = Math.max(1, Math.min(this.numberOfStepsToCompleteProfile, session.current_step));

    this.currentFrame.set(session.current_step > this.numberOfStepsToCompleteProfile ? 3 : 2);

    this.currentStepInCompletingProfile.set(step);

    this.sessionSyncDone.set(true);
  });

  async ngOnInit(): Promise<void> {
    const tokenFromUrl = this.route.snapshot.queryParamMap.get('token');

    if (tokenFromUrl) {
      this.onboardingService.getEntityByToken(tokenFromUrl);
    } else {
      this.router.navigateByUrl('/404');
    }
  }

  isMobile = this.utilService.isMobile;

  loading = signal<boolean>(false);
  serviceLoading = this.onboardingService.loading;
  isBusy = computed(() => this.loading() || this.serviceLoading());

  currentFrame = signal<number>(1);
  isExiting = signal<boolean>(false);
  nextStep() {
    this.loading.set(true);

    // trigger the "Exit" animation class
    this.isExiting.set(true);

    // wait for the CSS animation to finish (e.g., 500ms)
    setTimeout(() => {
      this.currentFrame.update((n) => n + 1);
      this.isExiting.set(false); // reset for the new frame
      this.loading.set(false);
    }, 500);
  }

  profilePictureFormGroup = new FormGroup({});

  primaryInformationFormGroup = new FormGroup({
    firstName: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    lastName: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    middleName: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    staffId: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  digitalSignatureFormGroup = new FormGroup({
    // image: new FormControl(null, Validators.required)
  });

  numberOfStepsToCompleteProfile = 3;
  currentStepInCompletingProfile = signal<number>(1);

  @ViewChild('stepper')
  stepper!: MatStepper;
  proceedToNextStepToCompleteProfile() {
    const currentStep = this.currentStepInCompletingProfile();
    const session = this.onboardingService.onboardingSession();

    if (session) {
      const primaryData: PrimaryInformationData = this.primaryInformationFormGroup.getRawValue();

      if (currentStep === 1) {
        this.onboardingService.updateOnboardingSessionData(session.id, {
          primaryData,
          currentStep: currentStep + 1,
        });
      } else if (currentStep === 2) {
        const file = this.profilePictureFile();
        if (file) {
          this.onboardingService.uploadOnboardingMedia(session.id, {
            type: 'profile_picture',
            file,
            currentStep: currentStep + 1,
          });
        }
      } else if (currentStep === 3) {
        const file = this.digitalSignatureFile();
        if (file) {
          this.onboardingService.uploadOnboardingMedia(session.id, {
            type: 'signature',
            file,
            currentStep: currentStep + 1,
          });

          this.onboardingService.completeOnboardingSession(session.id, 3);
        }
      }
    }

    this.currentStepInCompletingProfile.update((prev_value) => prev_value + 1);

    // move the stepper to the next step
    this.stepper.next();
  }

  revertToPreviousStepInCompletingProfile() {
    this.currentStepInCompletingProfile.update((prev_value) => prev_value - 1);

    // move the stepper to the next step
    this.stepper.previous();
  }

  isFinalStepInCompletingProfile() {
    return this.currentStepInCompletingProfile() === this.numberOfStepsToCompleteProfile;
  }

  profilePictureUploaded = signal<boolean>(false);
  profilePictureUploadedPath = signal<string>('upload-image.svg');
  profilePictureFile = signal<File | null>(null);
  uploadProfilePicture(event: any) {
    this.profilePictureUploaded.set(true);

    const fileUploadedPath = event.target.files[0];
    console.log(fileUploadedPath);

    this.profilePictureFile.set(fileUploadedPath);
    this.profilePictureUploadedPath.set(URL.createObjectURL(fileUploadedPath));
  }

  digitalSignatureImageUploaded = signal<boolean>(false);
  digitalSignatureImageUploadedPath = signal<string>('');
  digitalSignatureFile = signal<File | null>(null);
  uploadDigitalSignature(event: any) {
    this.digitalSignatureImageUploaded.set(true);

    const fileUploadedPath = event.target.files[0];

    this.digitalSignatureFile.set(fileUploadedPath);
    this.digitalSignatureImageUploadedPath.set(URL.createObjectURL(fileUploadedPath));
  }

  startOnboardingProcess() {
    if (!this.entity()) return;
    const invited = this.entity()!.details;

    // proceed to first step
    this.nextStep();

    // init the session
    this.onboardingService.initOnboardingSession(invited.id, invited.email);
  }

  isOnboardingProcessCompleted = signal<boolean>(false);
  completedOnboardingProcess = effect(() => {
    const onboardingSession = this.onboardingService.onboardingSession();

    if (!onboardingSession) return
    if(onboardingSession.current_step >= 3)
        this.isOnboardingProcessCompleted.set(true);
  });
}
