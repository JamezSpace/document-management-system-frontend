import { Component, inject } from '@angular/core';
import { Params, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NavBarItem } from '../../../../interfaces/nav-bar/NavBarItem.interface';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIcon } from '@spartan-ng/helm/icon';
import {
  lucideLayoutDashboard,
  lucideFileLock,
  lucideBell,
  lucideChevronRight,
} from '@ng-icons/lucide';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';

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
