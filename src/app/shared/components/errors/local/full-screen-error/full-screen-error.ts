import { Component, input, output } from '@angular/core';
import { PageError } from '../page-error/page-error';
import type { AppError } from '../../../../../models/ui/global/ErrorPresentation.ui';

@Component({
  selector: 'nexus-full-screen-error',
  imports: [PageError],
  template: `<nexus-page-error [error]="error()" (retry)="retry.emit()" (goBack)="goBack.emit()" />`,
  styles: `:host { position: fixed; inset: 0; z-index: 1000; display: block; background: white; }`,
})
export class FullScreenError {
  readonly error = input.required<AppError>();
  readonly retry = output<void>();
  readonly goBack = output<void>();
}
