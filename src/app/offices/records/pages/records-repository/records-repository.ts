import { Component, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideDownload, lucideEye, lucideFilter, lucideSearch } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCheckbox } from '@spartan-ng/helm/checkbox';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { RecordsPageShell } from '../../components/records-page-shell/records-page-shell';
import { RecordsService } from '../../services/records/records-service';

@Component({ selector: 'nexus-records-repository', imports: [NgIcon, HlmButtonImports, HlmCardImports, HlmCheckbox, HlmInput, HlmSheetImports, HlmTableImports, RecordsPageShell], templateUrl: './records-repository.html', providers: [provideIcons({ lucideChevronRight, lucideDownload, lucideEye, lucideFilter, lucideSearch })] })
class RecordsRepository { readonly records = inject(RecordsService); readonly repositorySeries = signal('Administrative records'); }

export { RecordsRepository };
