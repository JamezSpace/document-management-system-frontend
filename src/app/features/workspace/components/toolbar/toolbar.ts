import { Component, inject, output } from '@angular/core';
import { WorkspaceService } from '../../service/data/workspace-service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideFile, lucidePrinter } from '@ng-icons/lucide';
import { BrnAlertDialogContent } from '@spartan-ng/brain/alert-dialog';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { GovernanceService } from '../../service/data/governance-service';

@Component({
  selector: 'nexus-toolbar',
  imports: [NgIcon, HlmAlertDialogImports, BrnAlertDialogContent, HlmSpinner],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css',
  viewProviders: [provideIcons({ lucideArrowLeft, lucideFile, lucidePrinter })],
})
export class Toolbar {
  workspaceService = inject(WorkspaceService);
  readonly governanceExtracting = inject(GovernanceService).extracting;

  readonly ui = this.workspaceService.viewModel;
  readonly saving = this.workspaceService.saving;
  readonly previewRequested = output<void>();
  readonly printRequested = output<void>();
  readonly exportRequested = output<void>();

  exitWorkspace() {
    this.workspaceService.exitWorkspace();
  }

  saveDocument() {
    this.workspaceService.saveDocument();
  }

  previewDocument() {
    this.previewRequested.emit();
  }

  printCorrespondence() {
    this.printRequested.emit();
  }

  exportCorrespondence() {
    this.exportRequested.emit();
  }

  performPrimaryAction(action: string) {
    switch (action) {
      case 'save':
        this.saveDocument();
        return;
      default:
        return;
    }
  }
}
