import { Component, computed, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideRefreshCw, lucideTriangleAlert } from '@ng-icons/lucide';
import type { AppError } from '../../../../../models/ui/global/ErrorPresentation.ui';

@Component({
  selector: 'nexus-component-error',
  imports: [NgIcon],
  templateUrl: './component-error.html',
  styleUrl: './component-error.css',
  providers: [provideIcons({ lucideRefreshCw, lucideTriangleAlert })],
})
export class ComponentError {
  readonly error = input.required<AppError>();
  readonly retry = output<void>();
  readonly canRetry = computed(() => this.error().retryable);
}
