import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFilter, lucidePanelRightOpen, lucideScanLine, lucideSearch, lucideSlidersHorizontal } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { RecordsPageShell } from '../../components/records-page-shell/records-page-shell';
import { RecordsService } from '../../services/records/records-service';

@Component({ selector: 'nexus-incoming-register', imports: [NgIcon, RouterLink, HlmButtonImports, HlmInput, HlmSheetImports, HlmTableImports, RecordsPageShell], templateUrl: './incoming-register.html', providers: [provideIcons({ lucideFilter, lucidePanelRightOpen, lucideScanLine, lucideSearch, lucideSlidersHorizontal })] })
class IncomingRegister { readonly records = inject(RecordsService); }

export { IncomingRegister };
