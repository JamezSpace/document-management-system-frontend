import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './features/auth/service/auth-service';
import { ErrorBanner } from './shared/components/errors/global/error-banner/error-banner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ErrorBanner],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App{
  protected readonly title = signal('document-management-system-frontend');

  private authService = inject(AuthService);
  get isSecureEnvironmentLoading() {
    return this.authService.isSecureEnvironmentLoading();
  }

}
