import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArchive, lucideFilter, lucideFolderArchive, lucideLockKeyhole, lucideSearch } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInput } from '@spartan-ng/helm/input';
import { RecordsPageShell } from '../../components/records-page-shell/records-page-shell';

@Component({ selector: 'nexus-records-archives', imports: [NgIcon, HlmButtonImports, HlmCardImports, HlmInput, RecordsPageShell], templateUrl: './archives.html', providers: [provideIcons({ lucideArchive, lucideFilter, lucideFolderArchive, lucideLockKeyhole, lucideSearch })] })
class Archives {}

export { Archives };
