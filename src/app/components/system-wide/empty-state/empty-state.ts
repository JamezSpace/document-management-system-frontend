import { Component } from '@angular/core';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideFilePlusCorner } from '@ng-icons/lucide';

@Component({
  selector: 'nexus-empty-state',
  imports: [HlmEmptyImports, NgIcon],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css',
  providers: [
    provideIcons({
        lucideFilePlusCorner
    })
  ]
})
export class EmptyState {

}
