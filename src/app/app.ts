import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/page-wide/auth/auth-service';
import { SpartanP } from "./components/system-wide/typography/spartan-p/spartan-p";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SpartanP],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App{
  protected readonly title = signal('document-management-system-frontend');

  private authService = inject(AuthService);
  get isNotLoading() {
    return this.authService.getLoadingAsASignal();
  }

}
