import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideRoute } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmTextarea } from '@spartan-ng/helm/textarea';
import { RecordsPageShell } from '../../components/records-page-shell/records-page-shell';

@Component({ selector: 'nexus-routing-distribution', imports: [NgIcon, HlmButtonImports, HlmCardImports, HlmInput, HlmSeparator, HlmTextarea, RecordsPageShell], templateUrl: './routing-distribution.html', providers: [provideIcons({ lucideRoute })] })
class RoutingDistribution {}

export { RoutingDistribution };
