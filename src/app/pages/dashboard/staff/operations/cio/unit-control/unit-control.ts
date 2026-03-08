import { Component, inject, OnInit, signal } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMegaphone, lucideLogs, lucideMessageSquare, lucideSend, lucideCheckCircle } from '@ng-icons/lucide';
import { BrnAlertDialogContent, BrnAlertDialogTrigger } from '@spartan-ng/brain/alert-dialog';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmHoverCardImports } from '@spartan-ng/helm/hover-card';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { SpartanH3 } from '../../../../../../components/system-wide/typography/spartan-h3/spartan-h3';
import { SpartanH4 } from '../../../../../../components/system-wide/typography/spartan-h4/spartan-h4';
import { SpartanMuted } from '../../../../../../components/system-wide/typography/spartan-muted/spartan-muted';
import { SpartanP } from '../../../../../../components/system-wide/typography/spartan-p/spartan-p';
import { SpartanSmall } from '../../../../../../components/system-wide/typography/spartan-small/spartan-small';

@Component({
  selector: 'nexus-unit-control',
  imports: [
    SpartanH3,
    SpartanP,
    SpartanH4,
    SpartanMuted,
    SpartanSmall, 
    NgIcon,
    HlmSeparator,
    HlmSelectImports,
    HlmAlertDialogImports,
    HlmCardImports,
    HlmButtonImports,
    HlmButtonGroupImports,
    HlmHoverCardImports,
    HlmTextareaImports,
    BrnSelectImports,
    BrnAlertDialogContent,
    BrnAlertDialogTrigger,
    MatSlideToggleModule
  ],
  templateUrl: './unit-control.html',
  styleUrl: './unit-control.css',
  providers: [
    provideIcons({
      lucideMegaphone,
      lucideLogs,
      lucideMessageSquare,
      lucideSend,
      lucideCheckCircle
    }),
  ],
})
export class UnitControl implements OnInit {
    activatedRouter = inject(ActivatedRoute);

  directories = signal<string[]>([]);
  ngOnInit(): void {
    const currentPath = this.activatedRouter.snapshot.url.toString();

    this.directories.update((prev_directories) => [
      ...prev_directories,
      currentPath.replace(',', ' > '),
    ]);
  }

  priorityLevelSelected = signal<string>('')
  onPriorityLevelSelect(priorityLevelSelected: any) {
    this.priorityLevelSelected.set(priorityLevelSelected)
  }
}
