import { AfterViewInit, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import Quill from 'quill';
import { GenericDashboardService } from '../../../services/page-wide/dashboard/generic/generic-dashboard-service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLock, lucideLockOpen } from '@ng-icons/lucide';

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
  @ViewChild('editor')
  quillEditor!: ElementRef<HTMLDivElement>;
  quill!: Quill;

  editorLocked = signal<boolean>(false);

  genericDashboardService = inject(GenericDashboardService);

  ngAfterViewInit(): void {
    // Initialize Quill
    this.quill = new Quill(this.quillEditor.nativeElement, {
      theme: 'snow',
      modules: { toolbar: "#toolbar" },
      placeholder: 'Type a text here...',
    });

    // re-hydrate: Check if there is existing content in the service
    const savedContent = this.genericDashboardService.quillEditorContent();
    if (savedContent && savedContent.deltaContent) {
      // Use setContents (Delta) to maintain formatting perfectly
      this.quill.setContents(savedContent.deltaContent);
    }

    // Listen for changes
    this.quill.on('text-change', () => {
      this.genericDashboardService.quillEditorContent.set({
        deltaContent: this.quill.getContents(),
        textContent: this.quill.getText(),
        htmlContent: this.quill.getSemanticHTML(),
      });
    });
  }
}
