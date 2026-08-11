import { Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleAlert } from '@ng-icons/lucide';

@Component({
  selector: 'nexus-inline-error',
  imports: [NgIcon],
  templateUrl: './inline-error.html',
  styleUrl: './inline-error.css',
  providers: [provideIcons({ lucideCircleAlert })],
})
export class InlineError {
  readonly message = input.required<string>();
}
