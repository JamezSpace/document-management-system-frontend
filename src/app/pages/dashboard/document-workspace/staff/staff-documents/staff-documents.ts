import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmMenubarImports } from '@spartan-ng/helm/menubar';
import { HlmInputGroupImports, HlmInputGroup, HlmInputGroupAddon } from '@spartan-ng/helm/input-group';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { SpartanH3 } from '../../../../../components/system-wide/typograhy/spartan-h3/spartan-h3';
import { SpartanP } from '../../../../../components/system-wide/typograhy/spartan-p/spartan-p';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideArrowDownUp } from '@ng-icons/lucide';
import { hugeGridView } from '@ng-icons/huge-icons';



@Component({
  selector: 'nexus-staff-documents',
  imports: [
    HlmInputGroupImports,
    HlmBreadCrumbImports,
    HlmSeparatorImports,
    HlmDropdownMenuImports,
    HlmMenubarImports,
    SpartanH3,
    SpartanP,
    NgIcon,
    HlmInputGroup,
    HlmInputGroupAddon
],
  templateUrl: './staff-documents.html',
  styleUrl: './staff-documents.css',
  providers: [
    provideIcons({
      lucideSearch,
      lucideArrowDownUp,
      hugeGridView
    }),
  ],
})
export class StaffDocuments implements OnInit {
  router = inject(ActivatedRoute);
  ngOnInit(): void {
    const currentPath = this.router.snapshot.url.toString();

    this.directories.update((prev_directories) => [...prev_directories, currentPath]);
  }

  directories = signal<string[]>([]);
}
