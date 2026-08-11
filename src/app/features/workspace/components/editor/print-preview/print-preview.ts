import { Component, computed, input, output, signal, ViewEncapsulation } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGripVertical } from '@ng-icons/lucide';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmKbdImports } from '@spartan-ng/helm/kbd';

@Component({
  selector: 'nexus-print-preview',
  imports: [NgIcon, HlmDropdownMenuImports, HlmKbdImports],
  templateUrl: './print-preview.html',
  styleUrl: './print-preview.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.print-preview]': 'isPreviewing()',
  },
  providers: [provideIcons({ lucideGripVertical })],
})
export class PrintPreview {
  /** Whether the document is currently rendered as a print preview. */
  isPreviewing = input(false);

  /** The canvas scale provided by the paper controls. */
  canvasTransform = input('scale(1)');

  /** Whether the current user may leave preview mode. */
  canExitPreview = input(false);

  exit = output<void>();

  protected readonly paperActionsVisible = computed(
    () => this.isPreviewing() && this.canExitPreview() && this.paperViewControls(),
  );

  private readonly paperViewControls = signal(false);

  protected showPaperActions() {
    if (this.isPreviewing()) this.paperViewControls.set(true);
  }

  protected hidePaperActions() {
    this.paperViewControls.set(false);
  }

  protected requestExitPreview() {
    this.exit.emit();
  }
}
