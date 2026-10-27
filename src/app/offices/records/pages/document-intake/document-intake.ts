import { Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideCheck, lucideDownload, lucideInbox, lucideScanLine, lucideUpload } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmTextarea } from '@spartan-ng/helm/textarea';
import { RecordsPageShell } from '../../components/records-page-shell/records-page-shell';

@Component({ selector: 'nexus-document-intake', imports: [NgIcon, HlmButtonImports, HlmCardImports, HlmInput, HlmSeparator, HlmTextarea, RecordsPageShell], templateUrl: './document-intake.html', providers: [provideIcons({ lucideArrowRight, lucideCheck, lucideDownload, lucideInbox, lucideScanLine, lucideUpload })] })
class DocumentIntake {
  readonly intakeStep = signal(0);
  readonly intakeSteps = ['Capture', 'Quality check', 'Classify', 'Register', 'Route'] as const;

  setIntakeStep(step: number): void {
    this.intakeStep.set(Math.max(0, Math.min(step, this.intakeSteps.length - 1)));
  }
}

export { DocumentIntake };
