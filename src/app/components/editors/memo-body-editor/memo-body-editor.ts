import { AfterViewInit, Component, effect, ElementRef, EventEmitter, input, Output, ViewChild } from '@angular/core';
import Quill, { Delta } from 'quill';
import { EditorDataPreparation } from '../../../interfaces/workspace/EditorDataPreparation.ui';

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

    ngAfterViewInit(): void {
        this.quill = new Quill(this.quillEditor.nativeElement, {
            theme: 'snow',
            placeholder: 'Type a text here...',
        })
    }

    @Output()
    onFetchEditorContents = new EventEmitter()
    
    
    editorDataPreparation = input.required<EditorDataPreparation>();
    constructor() {
        effect(() => {
            const data = this.editorDataPreparation();

            if(data.neededNow) 
                this.onFetchEditorContents.emit(this.exportEditorContents(this.editorDataPreparation()))
        })
    }

    exportEditorContents(preference: EditorDataPreparation): Delta | string {
        if(preference.mode === 'delta') return this.quill.getContents();
        else return this.quill.getText()
    }
}