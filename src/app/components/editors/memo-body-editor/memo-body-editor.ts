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
import { DocumentsService } from '../../../services/page-wide/dashboard/generic/documents/documents-service';

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
  documentService = inject(DocumentsService);

  quill = signal<Quill | null>(null);
  quillEditor = viewChild<ElementRef<HTMLDivElement>>('editor');
  editorLocked = signal<boolean>(false);
  private saveTimer: any;
  private previewRenderer: Quill | null = null;
  private attachedEditorElement: HTMLDivElement | null = null;

  workspaceMode = this.documentService.workspaceMode;
  isReadOnly = this.documentService.isReadOnly;
  readonly isPrintPreview = computed(
    () => this.documentService.autoPrintPreview() || this.documentService.getManualPrintPreview()
  );

  ngAfterViewInit(): void {
    this.initializeQuillWhenReady();
  }

  ngOnDestroy(): void {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);

      // trigger the service update here if needed
    }

    this.previewRenderer = null;
  }

  MemoEditorContentEffect = effect(() => {
    const quill = this.quill();

    const savedContent = this.documentService.quillEditorContent();

    if (quill && savedContent.deltaContent) {
      const currentContents = quill.getContents();

      if (JSON.stringify(currentContents) !== JSON.stringify(savedContent.deltaContent)) {
        quill.setContents(savedContent.deltaContent, 'silent');
      }
    }
  });

  previewHtml = computed(() => {
    const savedContent = this.documentService.quillEditorContent();

    if (savedContent.htmlContent) return savedContent.htmlContent;
    if (!savedContent.deltaContent) return '';

    if (!this.previewRenderer) {
      this.previewRenderer = new Quill(document.createElement('div'), {
        theme: 'snow',
        modules: { toolbar: false },
      });
    }

    this.previewRenderer.setContents(savedContent.deltaContent as any, 'silent');

    return this.previewRenderer.getSemanticHTML();
  });

  LockEffect = effect(() => {
    const quill = this.quill();

    if (!quill) return;

    quill.enable(!this.isReadOnly());
  });

  private readonly quillInitEffect = effect(() => {
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

    const savedContent = this.documentService.quillEditorContent();
    if (savedContent.deltaContent) {
      quillInstance.setContents(savedContent.deltaContent as any, 'silent');
    }

    quillInstance.on('text-change', (delta, oldDelta, source) => {
      if (source !== 'user') return;

      if (this.saveTimer) {
        clearTimeout(this.saveTimer);
      }

      this.saveTimer = setTimeout(() => {
        this.documentService.quillEditorContent.set({
          deltaContent: quillInstance.getContents(),
          textContent: quillInstance.getText(),
          htmlContent: quillInstance.getSemanticHTML(),
        });
      }, 500);

      this.documentService.isDocumentSaved.set(false);
    });
  }
}
