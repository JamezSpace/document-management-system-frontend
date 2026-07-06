import { Component, inject } from '@angular/core';
import { WorkspaceService } from '../../service/data/workspace-service';
import { Router } from '@angular/router';
import { WorkspaceUiService } from '../../service/ui/workspace-ui-service';

@Component({
  selector: 'nexus-toolbar',
  imports: [],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css',
})
export class Toolbar {
  router = inject(Router);
  workspaceService = inject(WorkspaceService);
  
  readonly ui = this.workspaceService.viewModel;

  exitWorkspace() {
    this.workspaceService.exitWorkspace()
  }

  performPrimaryAction(action: string) {
    switch (action) {
        case 'save':
            return 
            break;
    
        default:
            break;
    }
  }
}
