import { Component, inject, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowDownUp, lucideHash, lucidePlus, lucideSearch } from '@ng-icons/lucide';
import { BrnAlertDialogContent, BrnAlertDialogTrigger } from '@spartan-ng/brain/alert-dialog';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmInputImports } from '@spartan-ng/helm/input';
import {
    HlmInputGroup,
    HlmInputGroupAddon,
    HlmInputGroupImports,
} from '@spartan-ng/helm/input-group';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmMenubarImports } from '@spartan-ng/helm/menubar';
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { SpartanH3 } from '../../../../../../components/system-wide/typography/spartan-h3/spartan-h3';
import { SpartanH4 } from '../../../../../../components/system-wide/typography/spartan-h4/spartan-h4';
import { SpartanMuted } from '../../../../../../components/system-wide/typography/spartan-muted/spartan-muted';
import { SpartanP } from '../../../../../../components/system-wide/typography/spartan-p/spartan-p';
import { UtilService } from '../../../../../../services/system-wide/util-service/util-service';

@Component({
  selector: 'nexus-staff-registry',
  imports: [
    MatStepperModule,
    SpartanH4,
    SpartanH3,
    SpartanP,
    SpartanMuted,
    BrnSelectImports,
    BrnAlertDialogContent,
    BrnAlertDialogTrigger,
    HlmInputGroupImports,
    HlmInputGroup,
    HlmInputGroupAddon,
    HlmRadioGroupImports,
    HlmAlertDialogImports,
    HlmMenubarImports,
    HlmDropdownMenuImports,
    HlmSelectImports,
    HlmInputImports,
    HlmLabelImports,
    HlmSeparator,
    ReactiveFormsModule,
    NgIcon,
  ],
  templateUrl: './staff-registry.html',
  styleUrl: './staff-registry.css',
  providers: [
    provideIcons({
      lucidePlus,
      lucideSearch,
      lucideArrowDownUp,
      lucideHash,
    }),
  ],
})
export class StaffRegistry {
  utilService = inject(UtilService);

  directories = signal<string[]>([]);
  isMobile = this.utilService.isMobile;

  staffPersonalInformationFormGroup = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    middleName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNum: new FormControl('', [Validators.required]),
  });

  professionalDetailsFormGroup = new FormGroup({
    internalUnit: new FormControl('', Validators.required),
    designation: new FormControl('', Validators.required),
    staffId: new FormControl('', Validators.required),
  });

  numberOfStepsToCompleteNewStaffRecord = 2;
  currentStepInCompletingNewStaffRecord = signal<number>(1);

  @ViewChild('stepper')
  stepper!: MatStepper;
  proceedToNextStepToCompleteNewStaffRecord() {
    this.currentStepInCompletingNewStaffRecord.update((prev_value) => prev_value + 1);

    // move the stepper to the next step
    this.stepper.next();
  }

  revertToPreviousStepInCompletingNewStaffRecord() {
    this.currentStepInCompletingNewStaffRecord.update((prev_value) => prev_value - 1);

    // move the stepper to the next step
    this.stepper.previous();
  }

  isFinalStepInCompletingNewStaffRecord() {
    return this.currentStepInCompletingNewStaffRecord() === this.numberOfStepsToCompleteNewStaffRecord;
  }

}
