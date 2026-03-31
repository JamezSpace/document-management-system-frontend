import { Component, inject, Input, signal, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatStepper, MatStep } from '@angular/material/stepper';
import { EntityType, EntityResponse } from '../../../interfaces/onboarding/entities/Entity.api';
import { OnboardingService } from '../../../services/page-wide/onboarding/onboarding-service';
import { UtilService } from '../../../services/system-wide/util-service/util-service';
import { LineLoader } from '../../../components/system-wide/loaders/line-loader/line-loader';
import { OnboardingNavBar } from '../../../components/system-wide/nav-bars/onboarding-nav-bar/onboarding-nav-bar';
import { IdCard } from '../../../components/dashboard-wide/id-card/id-card';
import { MatTooltip } from '@angular/material/tooltip';

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
  ],
  templateUrl: './onboarding-entity.html',
  styleUrl: './onboarding-entity.css',
})
export class OnboardingEntity {
  // used to create custom or different onboarding pages for different entities
  @Input() entityType!: EntityType;
  @Input() entityId!: string;
  private onboardingService = inject(OnboardingService);
  private utilService = inject(UtilService);

  entity = this.onboardingService.entity;

  async ngOnInit(): Promise<void> {
    // init deps

    // this will most likely be for users just resetting their password
    if (!this.onboardingService.entity())
      this.onboardingService.getEntityDetails({
        type: this.entityType,
        id: this.entityId,
      });
  }

  isMobile = this.utilService.isMobile;

  loading = signal<boolean>(false);
  currentFrame = signal<number>(1);
  isExiting = signal<boolean>(false);
  nextStep() {
    this.loading.set(true);

    // 1. Trigger the "Exit" animation class
    this.isExiting.set(true);

    // 2. Wait for the CSS animation to finish (e.g., 500ms)
    setTimeout(() => {
      this.currentFrame.update((n) => n + 1);
      this.isExiting.set(false); // Reset for the new frame
      this.loading.set(false);
    }, 500); // Match this to your CSS duration
  }

  profilePictureFormGroup = new FormGroup({});

  secondaryInformationFormGroup = new FormGroup({
    // email: new FormControl('', [Validators.required, Validators.email])
  });

  digitalSignatureFormGroup = new FormGroup({
    // image: new FormControl(null, Validators.required)
  });

  numberOfStepsToCompleteProfile = 3;
  currentStepInCompletingProfile = signal<number>(1);

  @ViewChild('stepper')
  stepper!: MatStepper;
  proceedToNextStepToCompleteProfile() {
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
  uploadProfilePicture(event: any) {
    this.profilePictureUploaded.set(true);

    const fileUploadedPath = event.target.files[0];
    console.log(fileUploadedPath);

    this.profilePictureUploadedPath.set(URL.createObjectURL(fileUploadedPath));
  }

  digitalSignatureImageUploaded = signal<boolean>(false);
  digitalSignatureImageUploadedPath = signal<string>('');
  uploadDigitalSignature(event: any) {
    this.digitalSignatureImageUploaded.set(true);

    const fileUploadedPath = event.target.files[0];

    this.digitalSignatureImageUploadedPath.set(URL.createObjectURL(fileUploadedPath));
  }
}
