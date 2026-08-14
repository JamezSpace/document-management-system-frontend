import { Component, computed, effect, inject, Input, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    lucideBadgeCheck,
    lucideContact,
    lucideHistory,
    lucideIdCard,
    lucideMail,
    lucidePhone,
    lucideShieldCheck,
    lucideShieldX,
    lucideUser,
    lucideUserRound,
} from '@ng-icons/lucide';
import { LineLoader } from '../../../../shared/components/loaders/line-loader/line-loader';
import { UtilService } from '../../../../shared/utils/service/util-service';
import { OnboardingService } from '../../services/session/onboarding-service';
import { OnboardingSessionStatus } from '../../../../enums/onboarding/sessionStatus.enum';
import { EntityType } from '../../../../models/api/onboarding/Entity.api';
import { OnboardingNavBar } from '../../../../shared/components/nav-bars/onboarding-nav-bar/onboarding-nav-bar';


type PrimaryInformationData = {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phoneNumber: string;
  staffId: string;
};

@Component({
  selector: 'nexus-onboarding-entity',
  imports: [
    LineLoader,
    OnboardingNavBar,
    MatStepperModule,
    ReactiveFormsModule,
    MatTooltip,
    NgIcon,
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
      lucidePhone,
      lucideBadgeCheck,
      lucideHistory,
      lucideShieldCheck,
      lucideShieldX,
    }),
  ],
})
export class OnboardingEntity {
  // used to create custom or different onboarding pages for different entities
  @Input() entityType!: EntityType;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private utilService = inject(UtilService);
  private onboardingService = inject(OnboardingService);

  entity = this.onboardingService.entity;
  errorFetchingEntity = this.onboardingService.error;

  private sessionSyncDone = signal<boolean>(false);
  private SyncFromEntityEffect = effect(() => {
    let retrievedData = this.onboardingService.extractEntityDetailsFromLocalStrorage();

    let entity = retrievedData.healthy ? retrievedData.entity : null;

    if (!entity) {
      entity = this.onboardingService.entity();
    }

    if (!entity || this.sessionSyncDone()) return;

    const inviteId = entity.details.id;

    if (!inviteId) return;

    this.onboardingService.fetchOnboardingSessionByInviteId(inviteId);

    const session = this.onboardingService.onboardingSession();

    if (!session) return;

    const primaryData =
      typeof session.primaryData === 'object' && session.primaryData !== null
        ? (session.primaryData as Partial<PrimaryInformationData>)
        : {};

    this.primaryInformationFormGroup.patchValue({
      firstName: primaryData.firstName ?? '',
      lastName: primaryData.lastName ?? '',
      middleName: primaryData.middleName ?? '',
      email: primaryData.email ?? session.email ?? '',
      phoneNumber: primaryData.phoneNumber ?? '',
      staffId: primaryData.staffId ?? '',
    });

    this.digitalSignatureImageUploaded.set(!!session.signaturePublicURL);

    if (session.signaturePublicURL) {
      this.digitalSignatureImageUploadedPath.set(session.signaturePublicURL);
    }

    this.profilePictureUploaded.set(!!session.profilePicPublicURL);

    if (session.profilePicPublicURL) {
      this.profilePictureUploadedPath.set(session.profilePicPublicURL);
    }

    const step = Math.max(1, Math.min(this.numberOfStepsToCompleteProfile, session.currentStep));

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

  isExiting = signal<boolean>(false);
  currentFrame = computed(() => {
    const session = this.onboardingService.onboardingSession();

    if (!session) return 1;

    if (session.status === OnboardingSessionStatus.COMPLETED) {
      return 3;
    }

    return 2;
  });

  previousFrame = signal<number>(1);
  FrameTransitionEffect = effect(() => {
    const current = this.currentFrame();
    const previous = this.previousFrame();

    if (current !== previous) {
      this.isExiting.set(true);

      setTimeout(() => {
        this.isExiting.set(false);
        this.previousFrame.set(current);
      }, 500);
    }
  });

  profilePictureFormGroup = new FormGroup({});

  primaryInformationFormGroup = new FormGroup({
    firstName: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    lastName: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    middleName: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    // TODO: implement strict regex check to allow +234 numbers or 07-, 08-, 09- nigerian numbers
    phoneNumber: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
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
            currentStep,
          });
        }
      }
    }

    if (currentStep !== 3)
      this.currentStepInCompletingProfile.update((prev_value) => prev_value + 1);

    // move the stepper to the next step
    // this.stepper.next();
  }

  revertToPreviousStepInCompletingProfile() {
    this.currentStepInCompletingProfile.update((prev_value) => prev_value - 1);

    // move the stepper to the next step
    this.stepper.previous();
  }

  isFinalStepInCompletingProfile() {
    return this.currentStepInCompletingProfile() === this.numberOfStepsToCompleteProfile;
  }

  isAllFieldsValid() {
    return (
      this.primaryInformationFormGroup.valid &&
      this.digitalSignatureImageUploaded() &&
      this.profilePictureUploaded()
    );
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

    // init the session
    this.onboardingService.initOnboardingSession(invited.id, invited.email);
  }

  isOnboardingProcessCompleted = signal<boolean>(false);
  CompleteOnboardingProcessEffect = effect(() => {
    const session = this.onboardingService.onboardingSession();

    if (
      session?.status !== OnboardingSessionStatus.COMPLETED &&
      session?.profilePicPublicURL &&
      session.signaturePublicURL
    ) {
      this.onboardingService.completeOnboardingSession(session.inviteId, session.id);
    }
  });

  CompletedOnboardingProcess = effect(() => {
    const onboardingSession = this.onboardingService.onboardingSession();

    if (!onboardingSession) return;
    if (onboardingSession.status === OnboardingSessionStatus.COMPLETED)
      this.isOnboardingProcessCompleted.set(true);
  });
}
