import { Component, inject, output } from '@angular/core';
import { WorkspaceService } from '../../service/data/workspace-service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideFile } from '@ng-icons/lucide';
import { BrnAlertDialogContent } from '@spartan-ng/brain/alert-dialog';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmSpinner } from '@spartan-ng/helm/spinner';

@Component({
  selector: 'nexus-toolbar',
  imports: [NgIcon, HlmAlertDialogImports, BrnAlertDialogContent, HlmSpinner],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css',
  viewProviders: [provideIcons({ lucideArrowLeft, lucideFile })],
})
export class Toolbar {
  workspaceService = inject(WorkspaceService);

  readonly ui = this.workspaceService.viewModel;
  readonly saving = this.workspaceService.saving;
  readonly previewRequested = output<void>();
  readonly printRequested = output<void>();

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

  performPrimaryAction(action: string) {
    switch (action) {
      case 'save':
        this.saveDocument();
        return;
      case 'export':
        this.printCorrespondence();
        return;
      default:
        return;
    }
  }
}
