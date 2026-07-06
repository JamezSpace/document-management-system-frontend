import { inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HlmSidebarService } from '@spartan-ng/helm/sidebar';
import { DocumentApi, emptyDocument } from '../../../../models/api/documents/Document.api';

@Injectable({
  providedIn: 'root',
})
export class RegistryService {
  private sidebar = inject(HlmSidebarService);
  private router = inject(Router)
  documentClicked = signal<DocumentApi>(emptyDocument);
  isDetailsOpen = signal(false);

  closeSidebar() {
    if (this.sidebar.state() === 'expanded') this.sidebar.toggleSidebar();
  }

  openSidebar() {
    if (this.sidebar.state() === 'collapsed') this.sidebar.toggleSidebar();
  }

  openDocDetails(docToOpen: DocumentApi) {
    // close sidebar
    this.closeSidebar();

    // open document details pane
    this.isDetailsOpen.set(true);

    this.documentClicked.set(docToOpen);
  }

  closeDocDetails() {
    // close the pane
    this.isDetailsOpen.set(false);

    // open the sidebar
    this.openSidebar();
  }

   navigateToWorkspace(activatedRouter: ActivatedRoute, documentId: string) {
    this.router.navigate(['workspace', documentId], { relativeTo: activatedRouter });    
  }

}
