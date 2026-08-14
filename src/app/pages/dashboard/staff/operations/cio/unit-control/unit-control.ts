import { Component, effect, inject, OnInit, signal } from '@angular/core';
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
import { UnitMembersService } from '../../../../../../features/documents/service/unit-members/unit-members-service';
import { CurrentStaffService } from '../../../../../../features/shared/services/current-staff/current-staff-service';

@Component({
  selector: 'nexus-unit-control',
  imports: [
    NgIcon,
    HlmSeparator,
    HlmSelectImports,
    HlmAlertDialogImports,
    HlmButtonImports,
    HlmCardImports,
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
  unitMembersService = inject(UnitMembersService);
  currentStaffService = inject(CurrentStaffService);

  unitMembers = this.unitMembersService.data;
  private unitMembersLoaded = signal<boolean>(false);

  directories = signal<string[]>([]);
  ngOnInit(): void {
    const currentPath = this.activatedRouter.snapshot.url.toString();

    this.directories.set(currentPath.split(','))
  }

  private unitMembersEffect = effect(() => {
    const staff = this.currentStaffService.data();
    if (!staff || this.unitMembersLoaded()) return;

    this.unitMembersService.fetchUnitMembers(staff.unit.id);
    this.unitMembersLoaded.set(true);
  });

  priorityLevelSelected = signal<string>('')
  onPriorityLevelSelect(priorityLevelSelected: any) {
    this.priorityLevelSelected.set(priorityLevelSelected)
  }
}
