import { Component, computed, effect, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideZoomIn, lucideZoomOut } from '@ng-icons/lucide';
import DocumentService from '../../../../shared/services/document/DocumentService';
import { WorkspaceService } from '../../../service/data/workspace-service';

@Component({
  selector: 'nexus-paper-controls',
  imports: [NgIcon],
  templateUrl: './paper-controls.html',
  styleUrl: './paper-controls.css',
  viewProviders: [provideIcons({ lucideZoomOut, lucideZoomIn })],
})
export class PaperControls {
  private readonly documentService = inject(DocumentService);
  private readonly workspaceService = inject(WorkspaceService);

  readonly zoomLevel = signal(1);
  private readonly previousZoomLevel = signal(1);
  readonly canvasTransform = computed(() => `scale(${this.zoomLevel()})`);
  readonly isPreviewing = computed(
    () => this.documentService.autoPrintPreview() || this.documentService.getManualPrintPreview(),
  );
  readonly canExitPreview = computed(() => this.workspaceService.permissions().editable);

  private readonly SyncReadOnlyPreview = effect(() => {
    this.documentService.setAutoPrintPreview(this.workspaceService.permissions().readonly);
  });

  zoomIn() {
    this.zoomLevel.update((z) => Math.min(z + 0.1, 2.0)); // Cap at 200%
  }

  zoomOut() {
    this.zoomLevel.update((z) => Math.max(z - 0.1, 0.5)); // Floor at 50%
  }

  resetZoom() {
    this.zoomLevel.set(1.0);
  }

  previewDocument() {
    this.previousZoomLevel.set(this.zoomLevel());
    this.resetZoom();
    this.documentService.setManualPrintPreview = true;
  }

  exitPreview() {
    this.zoomLevel.set(this.previousZoomLevel());
    this.documentService.setManualPrintPreview = false;
  }

  printCorrespondence() {
    const directive = this.workspaceService.workspaceContext()?.governance.extraction.print;
    if (!directive?.allowed || directive.deliveryMode === 'server_rendered_only') return;

    this.documentService.setManualPrintPreview = true;
    setTimeout(() => window.print(), 0);
  }
}
