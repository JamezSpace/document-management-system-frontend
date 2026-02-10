import { AfterViewInit, Component, effect, ElementRef, EventEmitter, inject, input, Output, ViewChild } from '@angular/core';
import Quill, { Delta } from 'quill';
import { GenericDashboardService } from '../../../services/page-wide/dashboard/generic/generic-dashboard-service';

@Component({
  selector: 'nexus-memo-body-editor',
  imports: [],
  templateUrl: './memo-body-editor.html',
  styleUrl: './memo-body-editor.css',
})
export class MemoBodyEditor implements AfterViewInit {
    @ViewChild('editor')
    quillEditor !: ElementRef<HTMLDivElement>;
    quill !: Quill;

    genericDashboardService = inject(GenericDashboardService)

    ngAfterViewInit(): void {
        this.quill = new Quill(this.quillEditor.nativeElement, {
            theme: 'snow',
            placeholder: 'Type a text here...',
        })

        this.quill.on('text-change', () => {
            const editorContentText = this.quill.getText()
            const editorContentDelta = this.quill.getContents()

            this.genericDashboardService.quillEditorContent.set({
                deltaContent: editorContentDelta,
                textContent: editorContentText
            })
        })
    }
}