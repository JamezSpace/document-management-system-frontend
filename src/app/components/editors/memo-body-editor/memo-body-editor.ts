import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
  ViewChild,
} from '@angular/core';
import Quill from 'quill';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLock, lucideLockOpen } from '@ng-icons/lucide';
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
export class MemoBodyEditor implements AfterViewInit {
  documentService = inject(DocumentsService);

  quillEditor = viewChild<ElementRef<HTMLDivElement>>('editor');
  quill = signal<Quill | null>(null);
  editorLocked = signal<boolean>(false);

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

      this.documentService.quillEditorContent.set({
        deltaContent: quillInstance.getContents(),
        textContent: quillInstance.getText(),
        htmlContent: quillInstance.getSemanticHTML(),
      });
    });
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
