import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArchive,
  lucideBell,
  lucideCircleCheckBig,
  lucideFilePlusCorner,
  lucideFileSearch,
  lucideInbox,
  lucideListTodo,
  lucideSearchX,
  lucideUserPlus,
  lucideUsers,
} from '@ng-icons/lucide';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import type { EmptyStateConfig } from '../../../models/ui/global/EmptyState.ui';

@Component({
  selector: 'nexus-empty-state',
  imports: [RouterModule, HlmEmptyImports, NgIcon],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css',
  providers: [
    provideIcons({
      lucideArchive,
      lucideBell,
      lucideCircleCheckBig,
      lucideFilePlusCorner,
      lucideFileSearch,
      lucideInbox,
      lucideListTodo,
      lucideSearchX,
      lucideUserPlus,
      lucideUsers,
    }),
  ],
})
export class EmptyState {
  readonly state = input.required<EmptyStateConfig>();
  readonly actionSelected = output<string>();

  selectAction(id: string): void {
    this.actionSelected.emit(id);
  }
}
