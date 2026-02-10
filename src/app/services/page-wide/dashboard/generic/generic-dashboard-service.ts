import { Injectable, signal } from '@angular/core';
import { Delta } from 'quill';

@Injectable({
  providedIn: 'root',
})
export class GenericDashboardService {
  loading = signal<boolean>(false);

  quillEditorContent = signal<{ deltaContent: Delta | null; textContent: string }>({
    deltaContent: null,
    textContent: '',
  });
}
