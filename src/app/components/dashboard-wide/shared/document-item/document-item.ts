import { Component, inject, input } from '@angular/core';
import { DocumentApi } from '../../../../interfaces/documents/Document.api';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMoreVertical } from '@ng-icons/lucide';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmMenubarImports } from '@spartan-ng/helm/menubar';
import { hugeFile02 } from '@ng-icons/huge-icons';
import { UtilService } from '../../../../services/system-wide/util-service/util-service';
import { SpartanP } from '../../../system-wide/typography/spartan-p/spartan-p';
import { RegistryService } from '../../../../services/page-wide/dashboard/documents-registry/registry/registry-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'nexus-document-item',
  imports: [NgIcon, SpartanP, HlmDropdownMenuImports, HlmMenubarImports],
  templateUrl: './document-item.html',
  styleUrl: './document-item.css',
  providers: [provideIcons({ lucideMoreVertical, hugeFile02 })],
})
export class DocumentItem {
    private activatedRouter = inject(ActivatedRoute);
  documentItem = input.required<DocumentApi>();
  utilService = inject(UtilService);
  registryService = inject(RegistryService);

  openDocPane() {
    this.registryService.openDocDetails(this.documentItem());
  }

  openWorkspaceEditor() {
    this.registryService.navigateToWorkspace(this.activatedRouter, this.documentItem().id)
  }
}
