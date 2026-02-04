import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { SpartanH3 } from '../../../../../components/public/spartan-h3/spartan-h3';
import { SpartanP } from '../../../../../components/public/spartan-p/spartan-p';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideArrowDownUp } from '@ng-icons/lucide';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmMenubarImports } from '@spartan-ng/helm/menubar';

@Component({
  selector: 'nexus-staff-documents',
  imports: [
    HlmBreadCrumbImports,
    HlmSeparatorImports,
    HlmDropdownMenuImports,
    HlmMenubarImports,
    SpartanH3,
    SpartanP,
    NgIcon,
  ],
  templateUrl: './staff-documents.html',
  styleUrl: './staff-documents.css',
  providers: [
    provideIcons({
      lucideSearch,
      lucideArrowDownUp,
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
