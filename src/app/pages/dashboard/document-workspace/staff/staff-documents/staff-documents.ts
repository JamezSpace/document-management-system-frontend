import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { hugeGridView } from '@ng-icons/huge-icons';
import {
    lucideArrowDownUp,
    lucideChevronDown,
    lucideLayoutTemplate,
    lucideSearch,
    lucideUpload,
} from '@ng-icons/lucide';
import { BrnAlertDialogContent, BrnAlertDialogTrigger } from '@spartan-ng/brain/alert-dialog';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import {
    HlmInputGroup,
    HlmInputGroupAddon,
    HlmInputGroupImports,
} from '@spartan-ng/helm/input-group';
import { HlmMenubarImports } from '@spartan-ng/helm/menubar';
import { HlmNavigationMenuImports } from '@spartan-ng/helm/navigation-menu';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { EmptyState } from '../../../../../components/system-wide/empty-state/empty-state';
import { SpartanH3 } from '../../../../../components/system-wide/typograhy/spartan-h3/spartan-h3';
import { SpartanH4 } from '../../../../../components/system-wide/typograhy/spartan-h4/spartan-h4';
import { SpartanP } from '../../../../../components/system-wide/typograhy/spartan-p/spartan-p';
import {
    EmptyStateType,
    type EmptyStateInterface,
} from '../../../../../interfaces/system/EmptyState.ui';
import { GenericDashboardService } from '../../../../../services/page-wide/dashboard/generic/generic-dashboard-service';

@Component({
  selector: 'nexus-staff-documents',
  imports: [
    HlmInputGroupImports,
    HlmAlertDialogImports,
    HlmBreadCrumbImports,
    HlmSeparatorImports,
    HlmDropdownMenuImports,
    HlmNavigationMenuImports,
    HlmMenubarImports,
    SpartanH3,
    SpartanH4,
    SpartanP,
    NgIcon,
    HlmInputGroup,
    HlmInputGroupAddon,
    EmptyState,
    BrnAlertDialogContent,
    BrnAlertDialogTrigger,
  ],
  templateUrl: './staff-documents.html',
  styleUrl: './staff-documents.css',
  providers: [
    provideIcons({
      lucideSearch,
      lucideArrowDownUp,
      hugeGridView,
      lucideChevronDown,
      lucideLayoutTemplate,
      lucideUpload,
    }),
  ],
})
export class StaffDocuments implements OnInit {
    genericDashboardService = inject(GenericDashboardService);

  activatedRouter = inject(ActivatedRoute);
  router = inject(Router);
  directories = signal<string[]>([]);
  ngOnInit(): void {
    const currentPath = this.activatedRouter.snapshot.url.toString();

    this.directories.update((prev_directories) => [...prev_directories, currentPath]);
  }

  emptyStateDataAsFistTime: EmptyStateInterface = {
    type: EmptyStateType.FIRST_TIME,
    iconName: 'lucideFilePlusCorner',
    title: 'No Documents Yet',
    supportingText:
      'This workspace will list documents you create, submit, or are granted access to. All document actions are logged and governed by policy.',
    actions: [
      {
        label: 'Create New Document',
        route: 'new',
      },
    ],
  };

  emptyStateDataAsNoData: EmptyStateInterface = {
    type: EmptyStateType.NO_DATA,
    iconName: 'lucideFileMinus',
    title: 'No Documents Available',
    supportingText: 'There are no documents available in this workspace.',
    actions: [
      {
        label: 'Create New Document',
        route: 'new',
      },
    ],
  };

  documents = signal<any[]>([]);

  navigateToWorkspace() {
    this.router.navigate(['workspace'], { relativeTo: this.activatedRouter });
  }

  showLoader() {
    this.genericDashboardService.loading.set(true);
  }

  processSelection(dialog: any, selectionType: 'template' | 'upload') {
    
    console.log(selectionType);
  }
}
