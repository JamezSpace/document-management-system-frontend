import { Component, inject } from '@angular/core';
import { Params, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    lucideBell,
    lucideChevronRight,
    lucideFileLock,
    lucideLayoutDashboard,
} from '@ng-icons/lucide';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { LineLoader } from "../../../../components/system-wide/loaders/line-loader/line-loader";
import { NavBarItem } from '../../../../interfaces/navigation/NavBarItem.interface';
import { StaffService } from '../../../../services/page-wide/dashboard/document-workspace/staff/staff-service';
import { GenericDashboardService } from '../../../../services/page-wide/dashboard/generic/generic-dashboard-service';

@Component({
  selector: 'nexus-dashboard-office-template',
  imports: [
    RouterOutlet,
    RouterLink,
    HlmSidebarImports,
    HlmCollapsibleImports,
    HlmSeparator,
    NgIcon,
    HlmIcon,
    LineLoader
],
  templateUrl: './dashboard-office-template.html',
  styleUrl: './dashboard-office-template.css',
  providers: [
    provideIcons({
      lucideLayoutDashboard,
      lucideFileLock,
      lucideBell,
      lucideChevronRight,
    }),
  ],
})
export class DashboardOfficeTemplate {
  navItems: NavBarItem[] = [
    {
      icon: 'lucideLayoutDashboard',
      label: 'work overview',
      route: 'overview',
      subMenuExists: false,
    },
    {
      icon: 'lucideFileLock',
      label: 'documents',
      route: 'documents',
      defaultOpen: false,
      subMenuExists: true,
      subMenus: [
        { label: 'My Drafts', route: { view: 'draft' } },
        { label: 'Submitted / In Progress', route: { view: 'in-progress' } },
        { label: 'Shared With Me', route: { view: 'shared' } },
      ],
    },
    {
      icon: 'lucideBell',
      label: 'Notices',
      route: 'notices',
      subMenuExists: false,
    },
  ];


  genericDashboardService = inject(GenericDashboardService);

  loading = this.genericDashboardService.loading;
  router = inject(Router);
  isMenuActive(intendedPath: string) {
    const currentPath = this.router.url.split('/');

    return currentPath[currentPath.length - 1] === intendedPath;
  }

  getCurrentPathParam(path: string): string {
    // this function takes in the path at the end after the main url has been splitted by '/'.
    // this function checks that path and returns the query parameter

    return path.split('?').pop() || '';
  }

  isSubMenuActive(intendedPath: Params) {
    const currentPathArray = this.router.url.split('/'),
    currentPathString = this.getCurrentPathParam(currentPathArray[currentPathArray.length - 1]),
      intendedPathString = new URLSearchParams(intendedPath).toString();

    return currentPathString === intendedPathString;
  }
}
