import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideTags } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCheckbox } from '@spartan-ng/helm/checkbox';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmTextarea } from '@spartan-ng/helm/textarea';
import { RecordsPageShell } from '../../components/records-page-shell/records-page-shell';

@Component({ selector: 'nexus-classification-indexing', imports: [NgIcon, HlmButtonImports, HlmCardImports, HlmCheckbox, HlmInput, HlmTableImports, HlmTextarea, RecordsPageShell], templateUrl: './classification-indexing.html', providers: [provideIcons({ lucideSearch, lucideTags })] })
class ClassificationIndexing {}

export { ClassificationIndexing };
