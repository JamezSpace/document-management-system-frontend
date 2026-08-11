import { Component, inject, output } from '@angular/core';
import { WorkspaceService } from '../../service/data/workspace-service';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'nexus-toolbar',
  imports: [NgIcon],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css',
})
export class Toolbar {
  workspaceService = inject(WorkspaceService);

  readonly ui = this.workspaceService.viewModel;
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
