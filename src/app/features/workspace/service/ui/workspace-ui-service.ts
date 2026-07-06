import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Delta, Op } from 'quill';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceUiService {
  private isDocumentSaved = signal<boolean>(true);
  private quillEditorContent = signal<{
    deltaContent: Delta | null;
    textContent: string;
    htmlContent: string;
  }>({
    deltaContent: null,
    textContent: '',
    htmlContent: '',
  });

  setIsDocumentSaved(value: boolean) {
    this.isDocumentSaved.set(value);
  }

  getIsDocumentSaved(): Signal<boolean> {
    return this.isDocumentSaved.asReadonly();
  }

  resetQuillEditorContent() {
    this.quillEditorContent.set({ deltaContent: null, textContent: '', htmlContent: '' });
  }

  setQuillEditorContent(data: { delta: unknown; html?: unknown; text?: unknown }) {
    this.quillEditorContent.set({
      deltaContent: new Delta(data.delta as { ops: Op[] }),
      htmlContent: data.html as string,
      textContent: data.text as string,
    });
  }

  getQuillEditorContent(): Signal<{
    deltaContent: Delta | null;
    textContent: string;
    htmlContent: string;
  }> {
    return this.quillEditorContent.asReadonly();
  }
}
