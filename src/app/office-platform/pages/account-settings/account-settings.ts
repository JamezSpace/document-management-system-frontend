import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBell,
  lucideCheck,
  lucideFingerprint,
  lucideHistory,
  lucideKeyRound,
  lucideLaptop,
  lucideShieldCheck,
} from '@ng-icons/lucide';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCheckbox } from '@spartan-ng/helm/checkbox';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { OfficeContextService } from '../../context/office-context.service';

@Component({
  selector: 'nexus-account-settings',
  imports: [
    NgIcon,
    MatTabsModule,
    HlmBreadCrumbImports,
    HlmButtonImports,
    HlmCardImports,
    HlmCheckbox,
    HlmSeparator,
  ],
  templateUrl: './account-settings.html',
  providers: [
    provideIcons({
      lucideBell,
      lucideCheck,
      lucideFingerprint,
      lucideHistory,
      lucideKeyRound,
      lucideLaptop,
      lucideShieldCheck,
    }),
  ],
})
class AccountSettings {
  readonly officeContext = inject(OfficeContextService);
}

export { AccountSettings };
