import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideDownload, lucideSearch, lucideShieldCheck } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { RecordsPageShell } from '../../components/records-page-shell/records-page-shell';

@Component({ selector: 'nexus-registry-audit-trail', imports: [NgIcon, HlmButtonImports, HlmCardImports, HlmInput, HlmTableImports, RecordsPageShell], templateUrl: './registry-audit-trail.html', providers: [provideIcons({ lucideChevronRight, lucideDownload, lucideSearch, lucideShieldCheck })] })
class RegistryAuditTrail {}

export { RegistryAuditTrail };
