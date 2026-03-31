import { Component, inject, input, ViewChild, computed } from '@angular/core';
import { DocumentApi } from '../../../../interfaces/documents/Document.api';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMoreVertical } from '@ng-icons/lucide';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmMenubarImports } from '@spartan-ng/helm/menubar';
import { hugeFile02, hugeFileSearch, hugeFileValidation } from '@ng-icons/huge-icons';
import { UtilService } from '../../../../services/system-wide/util-service/util-service';
import { RegistryService } from '../../../../services/page-wide/dashboard/documents-registry/registry/registry-service';
import { ActivatedRoute } from '@angular/router';
import { SideModalService } from '../../../../services/page-wide/dashboard/generic/side-modal/side-modal-service';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { DocumentsService } from '../../../../services/page-wide/dashboard/generic/documents/documents-service';
import { BrnAlertDialog } from '@spartan-ng/brain/alert-dialog';

@Component({
  selector: 'nexus-document-item',
  standalone: true,
  imports: [NgIcon, HlmDropdownMenuImports, HlmMenubarImports, HlmAlertDialogImports],
  templateUrl: './document-item.html',
  styleUrl: './document-item.css',
  providers: [provideIcons({ 
    lucideMoreVertical, hugeFile02, hugeFileSearch, 
    hugeFileValidation
  })],
})
export class DocumentItem {
  private activatedRouter = inject(ActivatedRoute);
  documentItem = input.required<DocumentApi>();
  utilService = inject(UtilService);
  registryService = inject(RegistryService);
  sideModalService = inject(SideModalService);
  documentService = inject(DocumentsService);

  // --- SIGNALS FOR UI STATE ---
  
  statusInfo = computed(() => {
    const state = this.documentItem().currentVersion?.lifecycle?.currentState?.toLowerCase() || 'draft';
    
    const themes: Record<string, { classes: string, icon: string }> = {
      'draft': { classes: 'border-amber-500/50 bg-amber-500/10 text-amber-600', icon: 'hugeFile02' },
      'submitted': { classes: 'border-amber-500/50 bg-amber-500/10 text-amber-600', icon: 'hugeFile02' },
      'in_review': { classes: 'border-[#c5a059]/80 bg-[#c5a059]/10 text-[#c5a059] animate-pulse', icon: 'hugeFileValidation' },
      'approved': { classes: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600', icon: 'hugeFileCheckmark02' },
      'active': { classes: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600', icon: 'hugeFileCheckmark02' },
      'declared_record': { classes: 'border-blue-500/50 bg-blue-500/10 text-blue-600', icon: 'hugeFileShield02' },
      'archived': { classes: 'border-blue-500/50 bg-blue-500/10 text-blue-600', icon: 'hugeFileShield02' },
      'cancelled': { classes: 'border-red-500/50 bg-red-500/10 text-red-600', icon: 'hugeFile02' },
    };

    return themes[state] || themes['draft'];
  });

  displayState = computed(() => 
    (this.documentItem().currentVersion?.lifecycle?.currentState || 'no content yet').replace('_', ' ')
  );

  // --- ACTIONS ---

  openDocPane() {
    this.registryService.openDocDetails(this.documentItem());
    
    this.sideModalService.open();
  }

  openWorkspaceEditor() {
    this.registryService.navigateToWorkspace(this.activatedRouter, this.documentItem().id);
  }

  @ViewChild('deleteDocumentAlertDialog') dialog!: BrnAlertDialog;
  
  deleteDocument() {
    const state = this.documentItem().currentVersion?.lifecycle.currentState?.toLowerCase();
    if (!state || state === 'draft') {
      this.documentService.deleteDocument(this.documentItem().id);
      this.dialog.close();
      return;
    }
    console.log('Only draft or documents with no content can be deleted');
  }
}