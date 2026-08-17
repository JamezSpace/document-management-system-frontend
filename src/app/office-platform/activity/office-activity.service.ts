import { computed, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OfficeActivityService {
  private readonly pendingRequests = signal(0);

  readonly activeRequestCount = this.pendingRequests.asReadonly();
  readonly isLoading = computed(() => this.pendingRequests() > 0);

  begin(): () => void {
    this.pendingRequests.update((count) => count + 1);
    let finished = false;

    return () => {
      if (finished) return;
      finished = true;
      this.pendingRequests.update((count) => Math.max(0, count - 1));
    };
  }
}
