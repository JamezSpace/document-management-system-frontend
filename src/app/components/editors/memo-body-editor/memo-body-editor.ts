import {
    AfterViewInit,
    Component,
    effect,
    ElementRef,
    inject,
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

  ngAfterViewInit(): void {
    const quillElement = this.quillEditor()?.nativeElement;
    if (!quillElement) return;

    // Initialize Quill
    const quillInstance = new Quill(quillElement, {
      theme: 'snow',
      modules: { toolbar: '#toolbar' },
      placeholder: 'Type a text here...',
    });

    this.quill.set(quillInstance);

    // Listen for changes
    quillInstance.on('text-change', (delta, oldDelta, source) => {
      if (source !== 'user') return;

      // this clears the previous timer every time a key is pressed
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

      // toggle saved state
      this.documentService.isDocumentSaved.set(false);
    });
  }

  ngOnDestroy(): void {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
      // Manually trigger the service update here if needed
    }
  }

  private memoEditorContentEffect = effect(() => {
    const quill = this.quill();

    const savedContent = this.documentService.quillEditorContent();

    if (quill && savedContent.deltaContent) {
      const currentContents = quill.getContents();

      if (JSON.stringify(currentContents) !== JSON.stringify(savedContent.deltaContent)) {
        quill.setContents(savedContent.deltaContent, 'silent');
      }
    }
  });
}
