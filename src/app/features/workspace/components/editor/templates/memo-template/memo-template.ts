import { Component, input } from '@angular/core';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { MemoViewModel } from '../../../../../../models/ui/workspace/MemoViewModel.ui';

@Component({
  selector: 'nexus-memo-template',
  imports: [HlmSeparator],
  templateUrl: './memo-template.html',
  styleUrl: './memo-template.css',
})
export class MemoTemplate {
  correspondence = input.required<MemoViewModel>();
  
  formattedDate(date: string | Date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
