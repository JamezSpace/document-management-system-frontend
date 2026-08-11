import { Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideRefreshCw, lucideTriangleAlert, lucideX } from '@ng-icons/lucide';
import { ErrorRecovery } from '../../../../../enums/global/errorRecovery.enum';
import { ErrorBannerService } from '../../../../../core/services/error/banner/error-banner';
import { ErrorRecoveryService } from '../../../../../core/services/error/recovery/error-recovery';

@Component({
  selector: 'nexus-error-banner',
  imports: [NgIcon],
  templateUrl: './error-banner.html',
  styleUrl: './error-banner.css',
  providers: [provideIcons({ lucideRefreshCw, lucideTriangleAlert, lucideX })],
})
export class ErrorBanner {
  readonly banner = inject(ErrorBannerService);
  private readonly recoveryService = inject(ErrorRecoveryService);
  readonly hasRecovery = computed(() => this.banner.error()?.recovery !== ErrorRecovery.NONE);

  recover(): void {
    const error = this.banner.error();
    if (!error) return;
    this.recoveryService.recover(error.recovery);
    this.banner.dismiss();
  }
}
