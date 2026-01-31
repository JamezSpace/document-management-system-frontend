import { Component, ElementRef, inject, Input, OnInit, signal, ViewChild, viewChildren } from '@angular/core';
import { OnboardingService } from '../../services/onboarding/onboarding-service';
import type { EntityResponse } from '../../interfaces/onboarding/entities/Entity.api-model';
import { EntityType } from '../../interfaces/onboarding/entities/Entity.api-model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { IdCard } from '../../components/id-card/id-card';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'nexus-onboarding',
  imports: [
      IdCard,
    NgxExtendedPdfViewerModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatCheckboxModule,
    MatTooltipModule,
  ],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.css',
})
export class Onboarding implements OnInit {
  // used to create custom or different onboarding pages for different entities
  @Input() entityType!: EntityType;
  @Input() entityId!: string;
  private onboardingService = inject(OnboardingService);

  entity = signal<EntityResponse>({
    type: EntityType.STAFF,
    details: {
      id: '90123',
      first_name: 'samuel',
      last_name: 'james',
      role: 'editor',
      email: 'adobeclip2003@gmail.com',
    },
  });

  async ngOnInit(): Promise<void> {
    await this.onboardingService.getEntityDetails({
      type: this.entityType,
      id: this.entityId,
    });
  }

  private breakpointObserver = inject(BreakpointObserver);

  // 1. Create a signal that is true when we are on a small screen (e.g., Handset)
  isMobile = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.Handset, '(max-width: 768px)'])
      .pipe(map(result => result.matches)),
    { initialValue: false }
  );

  totalNumberOfSteps = 2;
  currentStep = signal<number>(1);
  hasDataBeenSubmitted = signal<boolean>(false);

  proceedToNextStep() {
    this.currentStep.update((prev_value) => prev_value + 1);
  }

  backToPreviousStep() {
    this.currentStep.update((prev_value) => prev_value - 1);
  }

  isFinalStep() {
    return this.currentStep() === this.totalNumberOfSteps;
  }

  isAnimationLeaveOn = signal<boolean>(false);
  nextStep(currentFrameRef: string) {
    this.isAnimationLeaveOn.set(!this.isAnimationLeaveOn());
  }

  readonly frames = viewChildren<any>('frame');
  getFrame(id: string) {
    const frame = this.frames().find((frame) => frame.id === id);

    if (!frame) return { exists: false };
    return { exists: true, frame };
  }

  makeFrameInvisible(frame: ElementRef<HTMLDivElement>) {
    frame.nativeElement.classList.add('hidden');
  }

  makeFrameVisible(frame: ElementRef<HTMLDivElement>) {
    frame.nativeElement.classList.remove('hidden');
  }

  agreedToTerms = signal<boolean>(false);
  toggleAgreementChoice() {
    this.agreedToTerms.set(!this.agreedToTerms());
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
  stepper !: MatStepper;
  proceedToNextStepToCompleteProfile() {
    this.currentStepInCompletingProfile.update((prev_value) => prev_value + 1);

    // move the stepper to the next step
    this.stepper.next()
  }

  revertToPreviousStepInCompletingProfile() {
    this.currentStepInCompletingProfile.update((prev_value) => prev_value - 1);

    // move the stepper to the next step
    this.stepper.previous()
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
