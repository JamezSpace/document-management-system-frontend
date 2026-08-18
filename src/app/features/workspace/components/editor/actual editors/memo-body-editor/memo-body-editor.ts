import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLock, lucideLockOpen } from '@ng-icons/lucide';
import Quill from 'quill';
import DocumentService from '../../../../../shared/services/document/DocumentService';
import { WorkspaceService } from '../../../../service/data/workspace-service';
import { WorkspaceUiService } from '../../../../service/ui/workspace-ui-service';


@Component({
  selector: 'nexus-memo-body-editor',
  imports: [NgIcon],
  templateUrl: './memo-body-editor.html',
  styleUrl: './memo-body-editor.css',
  providers: [
    provideIcons({
      lucideLock,
      lucideLockOpen,
    }),
  ],
})
export class MemoBodyEditor implements AfterViewInit, OnDestroy {
  documentService = inject(DocumentService);
  workspaceService = inject(WorkspaceService);
  workspaceUiService = inject(WorkspaceUiService);

  quill = signal<Quill | null>(null);
  quillEditor = viewChild<ElementRef<HTMLDivElement>>('editor');
  editorLocked = signal<boolean>(false);
  private previewRenderer: Quill | null = null;
  private attachedEditorElement: HTMLDivElement | null = null;

  isReadOnly = computed(() => this.workspaceService.permissions().readonly);
  readonly isPrintPreview = computed(
    () => this.documentService.autoPrintPreview() || this.documentService.getManualPrintPreview()
  );

  ngAfterViewInit(): void {
    this.initializeQuillWhenReady();
  }

  ngOnDestroy(): void {
    this.previewRenderer = null;
  }

  MemoEditorContentEffect = effect(() => {
    const quill = this.quill();

    const savedContent = this.workspaceUiService.getQuillEditorContent();
    const deltaContent = savedContent().deltaContent;

    if (quill && deltaContent) {
      const currentContents = quill.getContents();

      if (JSON.stringify(currentContents) !== JSON.stringify(deltaContent)) {
        quill.setContents(deltaContent, 'silent');
      }
    }
  });

  previewHtml = computed(() => {
    const savedContent = this.workspaceUiService.getQuillEditorContent();
    const deltaContent = savedContent().deltaContent;
    const htmlContent = savedContent().htmlContent;

    if (htmlContent) return htmlContent;
    if (!deltaContent) return '';

    if (!this.previewRenderer) {
      this.previewRenderer = new Quill(document.createElement('div'), {
        theme: 'snow',
        modules: { toolbar: false },
      });
    }

    this.previewRenderer.setContents(deltaContent as any, 'silent');

    return this.previewRenderer.getSemanticHTML();
  });

  LockEffect = effect(() => {
    const quill = this.quill();

    if (!quill) return;

    quill.enable(!this.isReadOnly());
  });

  private readonly QuillInitEffect = effect(() => {
    if (this.isPrintPreview()) return;

    // Wait for the @else block to render the editor container before initializing Quill.
    setTimeout(() => this.initializeQuillWhenReady(), 0);
  });

  private initializeQuillWhenReady() {
    const quillElement = this.quillEditor()?.nativeElement;
    const quill = this.quill();

    // the editor DOM is only rendered in author/edit mode, so we wait until it actually exists.
    if (!quillElement || this.isPrintPreview()) return;

    // if preview mode swapped the DOM out, Quill must be reattached to the new editor element.
    if (quill && this.attachedEditorElement === quillElement) {
      return;
    }

    const quillInstance = new Quill(quillElement, {
      theme: 'snow',
      modules: { toolbar: '#toolbar' },
      placeholder: 'Type a text here...',
    });

    this.quill.set(quillInstance);
    this.attachedEditorElement = quillElement;

    quillInstance.enable(!this.isReadOnly());

    const savedContent = this.workspaceUiService.getQuillEditorContent();
    const deltaContent = savedContent().deltaContent;
    if (deltaContent) {
      quillInstance.setContents(deltaContent as any, 'silent');
    }

    quillInstance.on('text-change', (delta, oldDelta, source) => {
      if (source !== 'user') return;

      this.workspaceUiService.updateQuillEditorContent({
        delta: quillInstance.getContents(),
        text: quillInstance.getText(),
        html: quillInstance.getSemanticHTML(),
      });
    });
  }
}
