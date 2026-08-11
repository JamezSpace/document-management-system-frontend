import { Component, computed, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideRefreshCw, lucideTriangleAlert } from '@ng-icons/lucide';
import { ErrorRecovery } from '../../../../../enums/global/errorRecovery.enum';
import type { AppError } from '../../../../../models/ui/global/ErrorPresentation.ui';

@Component({
  selector: 'nexus-page-error',
  imports: [NgIcon],
  templateUrl: './page-error.html',
  styleUrl: './page-error.css',
  providers: [provideIcons({ lucideArrowLeft, lucideRefreshCw, lucideTriangleAlert })],
})
export class PageError {
  readonly error = input.required<AppError>();
  readonly retry = output<void>();
  readonly goBack = output<void>();

  readonly canRetry = computed(
    () => this.error().retryable || this.error().recovery === ErrorRecovery.RETRY,
  );
  readonly canGoBack = computed(() => this.error().recovery === ErrorRecovery.GO_BACK);
}
