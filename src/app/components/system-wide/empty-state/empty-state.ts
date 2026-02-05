import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFilePlusCorner } from '@ng-icons/lucide';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { EmptyStateInterface } from '../../../interfaces/system/EmptyState.ui';

@Component({
  selector: 'nexus-empty-state',
  imports: [RouterModule, HlmEmptyImports, NgIcon],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css',
  providers: [
    provideIcons({
      lucideFilePlusCorner,
    }),
  ],
})
export class EmptyState {
  @Input({required: true})
  stateData!: EmptyStateInterface;
}
