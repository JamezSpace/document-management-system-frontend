import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideRefreshCw, lucideTriangleAlert } from '@ng-icons/lucide';
import { CurrentStaffService } from '../../../features/shared/services/current-staff/current-staff-service';

@Component({
  selector: 'nexus-system-error',
  imports: [NgIcon],
  templateUrl: './system-error.html',
  styleUrl: './system-error.css',
  providers: [provideIcons({ lucideRefreshCw, lucideTriangleAlert })],
})
export class SystemError {
  private readonly router = inject(Router);
  private readonly staffService = inject(CurrentStaffService);

  readonly error = this.staffService.error;

  retry(): void {
    this.staffService.resetContext();
    void this.router.navigateByUrl('/office');
  }
}
