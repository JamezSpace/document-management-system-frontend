import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { Params, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideAward,
  lucideBell,
  lucideBriefcase,
  lucideCalendarCheck,
  lucideCheckSquare,
  lucideChevronRight,
  lucideClipboardList,
  lucideExternalLink,
  lucideFileLock,
  lucideHardHat,
  lucideLayoutDashboard,
  lucidePackageSearch,
  lucideServer,
  lucideUsers,
  lucideUserCheck,
  lucideZap,
  lucideSettings,
  lucideLogOut
} from '@ng-icons/lucide';
import { BrnAlertDialogContent, BrnAlertDialogTrigger } from '@spartan-ng/brain/alert-dialog';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmSidebarImports, HlmSidebarService } from '@spartan-ng/helm/sidebar';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { LineLoader } from '../../../../components/system-wide/loaders/line-loader/line-loader';
import {
  NavBarItem,
  NavGroup,
  SubMenu,
} from '../../../../interfaces/navigation/NavBarItem.interface';
import { GenericDashboardService } from '../../../../services/page-wide/dashboard/generic/generic-dashboard-service';
import { Workspace } from '../../staff/general/workspace/workspace';
import { StaffDetailsService } from '../../../../services/page-wide/dashboard/office-template/staff-details-service';
import { AuthService } from '../../../../services/page-wide/auth/auth-service';

@Component({
  selector: 'nexus-dashboard-office-template',
  imports: [
    RouterOutlet,
    RouterLink,
    HlmSidebarImports,
    HlmCollapsibleImports,
    HlmAlertDialogImports,
    HlmAvatarImports,
    HlmButtonImports,
    HlmSeparator,
    NgIcon,
    HlmIcon,
    LineLoader,
    BrnAlertDialogContent,
    BrnAlertDialogTrigger,
  ],
  templateUrl: './dashboard-office-template.html',
  styleUrl: './dashboard-office-template.css',
  providers: [
    provideIcons({
      lucideLayoutDashboard,
      lucideFileLock,
      lucideBell,
      lucideCheckSquare,
      lucideChevronRight,
      lucideExternalLink,
      lucideServer,
      lucideUsers,
      lucideUserCheck,
      lucideAward,
      lucideCalendarCheck,
      lucideBriefcase,
      lucideZap,
      lucideClipboardList,
      lucideHardHat,
      lucidePackageSearch,
      lucideSettings,
      lucideLogOut
    }),
  ],
})
export class DashboardOfficeTemplate implements OnInit {
  staffDetailsService = inject(StaffDetailsService);
  genericDashboardService = inject(GenericDashboardService);
  authService = inject(AuthService);
  sidebarService = inject(HlmSidebarService)
  router = inject(Router);

  staffLoggedIn = this.staffDetailsService.data;

  navigateOnDataReadiness = effect(() => {
    const isLoading = this.staffDetailsService.loading();
    const data = this.staffDetailsService.data();
    const error = this.staffDetailsService.error();

    this.authService.setLoading(isLoading);

    if (!isLoading) {
      if (!data) {
        this.router.navigateByUrl('/unauthorized');

        // this.authService.setLoading(false);

        this.authService.resetContext();
      } else {
        console.log('Access Granted');
      }
    }

    this.authService.loadUserContext(data);
  });

  async ngOnInit(): Promise<void> {
    this.staffDetailsService.fetchStaffDetailsForLogin();
  }

  //   navItems: NavBarItem[] = [
  //     {
  //       icon: 'lucideLayoutDashboard',
  //       label: 'work overview',
  //       route: 'overview',
  //       subMenuExists: false,
  //       group: NavGroup.GENERAL,
  //     },
  //     {
  //       icon: 'lucideFileLock',
  //       label: 'documents',
  //       route: 'documents',
  //       group: NavGroup.GENERAL,
  //       defaultOpen: false,
  //       subMenuExists: true,
  //       subMenus: [
  //         { label: 'My Drafts', route: { view: 'draft' } },
  //         { label: 'Submitted / In Progress', route: { view: 'in-progress' } },
  //         { label: 'Shared With Me', route: { view: 'shared' } },
  //       ],
  //     },
  //     {
  //       icon: 'lucideBell',
  //       label: 'Notices',
  //       route: 'notices',
  //       subMenuExists: false,
  //       group: NavGroup.GENERAL,
  //     },
  //     {
  //       icon: 'lucideCheckSquare',
  //       label: 'My Assignments',
  //       route: 'operations/tasks',
  //       subMenuExists: false,
  //       group: NavGroup.OPERATIONS,
  //     },
  //     // Add these to the NavGroup.OPERATIONS for the CIO role
  //     {
  //       icon: 'lucideZap', // Represents immediate action/directives
  //       label: 'Unit Control',
  //       route: 'operations/unit-control',
  //       subMenuExists: false,
  //       group: NavGroup.OPERATIONS,
  //     },
  //     {
  //       icon: 'lucideClipboardList', // Represents the log of official orders
  //       label: 'Directives Log',
  //       route: 'operations/directives',
  //       subMenuExists: false,
  //       group: NavGroup.OPERATIONS,
  //     },
  //     {
  //       icon: 'lucideHardHat', // Represents the industrial/technical workforce
  //       label: 'Technical Team',
  //       route: 'operations/team-ops',
  //       subMenuExists: true,
  //       group: NavGroup.OPERATIONS,
  //       subMenus: [
  //         { label: 'Shift Roster', route: { view: 'roster' } },
  //         { label: 'Performance Analytics', route: { view: 'analytics' } },
  //       ],
  //     },
  //     {
  //       icon: 'lucidePackageSearch', // Represents industrial equipment and requisitions
  //       label: 'Equipment & Vault',
  //       route: 'operations/inventory',
  //       subMenuExists: false,
  //       group: NavGroup.OPERATIONS,
  //     },
  //     {
  //       icon: 'lucideServer',
  //       label: 'Student IT Portal',
  //       leadsToExternalService: true,
  //       route: 'https://studentit.itcc.edu.ng',
  //       subMenuExists: false,
  //       group: NavGroup.OPERATIONS,
  //     },
  //     // Add these to your navItems array for an HR role
  //     {
  //       icon: 'lucideUsers',
  //       label: 'Staff Records',
  //       route: 'operations/staff',
  //       subMenuExists: false,
  //       group: NavGroup.OPERATIONS,
  //       //   subMenus: [
  //       //     { label: 'Academic Staff', route: { view: 'academic' } },
  //       //     { label: 'Non-Academic Staff', route: { view: 'non-academic' } },
  //       //   ],
  //     },
  //     {
  //       icon: 'lucideAward',
  //       label: 'A&P Exercises', // Appointments & Promotions
  //       route: 'promotions',
  //       subMenuExists: false,
  //       group: NavGroup.OPERATIONS,
  //     },
  //     {
  //       icon: 'lucideCalendarCheck',
  //       label: 'Leave Management',
  //       route: 'leave',
  //       subMenuExists: false,
  //       group: NavGroup.OPERATIONS,
  //     },
  //     {
  //       icon: 'lucideBriefcase',
  //       label: 'Establishment',
  //       route: 'establishment',
  //       leadsToExternalService: false,
  //       subMenuExists: false,
  //       group: NavGroup.OPERATIONS,
  //     },
  //   ];

  private NAV_REGISTRY: NavBarItem[] = [
    {
      icon: 'lucideLayoutDashboard',
      label: 'work overview',
      route: 'overview',
      subMenuExists: false,
      group: NavGroup.GENERAL,
      requiredCapability: 'document.view',
    },
    {
      icon: 'lucideFileLock',
      label: 'documents',
      route: 'documents',
      group: NavGroup.GENERAL,
      defaultOpen: false,
      subMenuExists: true,
      requiredCapability: 'document.view',
      subMenus: [
        {
          label: 'My Drafts',
          route: { view: 'draft' },
          requiredCapability: 'document.view',
        },
        {
          label: 'Submitted / In Progress',
          route: { view: 'in-progress' },
          requiredCapability: 'document.view',
        },
        {
          label: 'Shared With Me',
          route: { view: 'shared' },
          requiredCapability: 'document.view',
        },
      ],
    },
    {
      icon: 'lucideBell',
      label: 'Notices',
      route: 'notices',
      subMenuExists: false,
      group: NavGroup.GENERAL,
      requiredCapability: 'directive.view',
    },
    {
      icon: 'lucideCheckSquare',
      label: 'My Assignments',
      route: 'operations/tasks',
      subMenuExists: false,
      group: NavGroup.OPERATIONS,
      requiredCapability: 'workflow.forward',
    },

    // UNIT CONTROL (high authority)
    {
      icon: 'lucideZap',
      label: 'Unit Control',
      route: 'operations/unit-control',
      subMenuExists: false,
      group: NavGroup.OPERATIONS,
      requiredCapability: 'directive.issue',
    },

    {
      icon: 'lucideClipboardList',
      label: 'Directives Log',
      route: 'operations/directives',
      subMenuExists: false,
      group: NavGroup.OPERATIONS,
      requiredCapability: 'directive.view',
    },

    {
      icon: 'lucideHardHat',
      label: 'Technical Team',
      route: 'operations/team-ops',
      subMenuExists: true,
      group: NavGroup.OPERATIONS,
      requiredCapability: 'staff.view',
      subMenus: [
        {
          label: 'Shift Roster',
          route: { view: 'roster' },
          requiredCapability: 'staff.view',
        },
        {
          label: 'Performance Analytics',
          route: { view: 'analytics' },
          requiredCapability: 'staff.view',
        },
      ],
    },

    {
      icon: 'lucidePackageSearch',
      label: 'Equipment & Vault',
      route: 'operations/inventory',
      subMenuExists: false,
      group: NavGroup.OPERATIONS,
      requiredCapability: 'record.archive',
    },

    {
      icon: 'lucideServer',
      label: 'Student IT Portal',
      route: 'https://studentit.itcc.edu.ng',
      leadsToExternalService: true,
      subMenuExists: false,
      group: NavGroup.OPERATIONS,
      requiredCapability: 'document.view', // fallback (or create real perm later)
    },

    // HR / ADMIN
    {
      icon: 'lucideUsers',
      label: 'Staff Records',
      route: 'operations/staff',
      subMenuExists: false,
      group: NavGroup.OPERATIONS,
      requiredCapability: 'staff.view',
    },

    {
      icon: 'lucideUserCheck',
      label: 'Pending Staff Activations',
      route: 'operations/staff-activation',
      subMenuExists: false,
      group: NavGroup.OPERATIONS,
      requiredCapability: 'staff.activate',
    },

    {
      icon: 'lucideAward',
      label: 'A&P Exercises',
      route: 'promotions',
      subMenuExists: false,
      group: NavGroup.OPERATIONS,
      requiredCapability: 'staff.update',
    },

    {
      icon: 'lucideCalendarCheck',
      label: 'Leave Management',
      route: 'leave',
      subMenuExists: false,
      group: NavGroup.OPERATIONS,
      requiredCapability: 'staff.update',
    },

    {
      icon: 'lucideBriefcase',
      label: 'Establishment',
      route: 'establishment',
      leadsToExternalService: false,
      subMenuExists: false,
      group: NavGroup.OPERATIONS,
      requiredCapability: 'staff.create',
    },
  ];

  readonly navItems = computed(() => {
    return this.NAV_REGISTRY.map((item) => {
      // filter submenus first
      const filteredSubMenus = this.filterSubMenus(item.subMenus);

      // check access
      const hasItemAccess =
        this.hasAccess(item.requiredCapability, item.requiredAnyCapabilities) ||
        (filteredSubMenus && filteredSubMenus.length > 0);

      if (!hasItemAccess) return null;

      return {
        ...item,
        subMenus: filteredSubMenus,
        subMenuExists: !!filteredSubMenus?.length,
      };
    }).filter(Boolean) as NavBarItem[];
  });

  groupedNavItems = computed(() => {
    const groups = new Map<string, NavBarItem[]>();

    for (const item of this.navItems()) {
      if (!groups.has(item.group)) {
        groups.set(item.group, []);
      }
      groups.get(item.group)!.push(item);
    }

    return Array.from(groups.entries()).map(([groupName, items]) => ({
      groupName,
      items,
    }));
  });

  private hasAccess(required?: string, any?: string[]): boolean {
    if (!required && !any) return true;

    if (required && this.authService.hasCapability(required)) return true;

    if (any && any.some((cap) => this.authService.hasCapability(cap))) return true;

    return false;
  }

  private filterSubMenus(subMenus?: SubMenu[]): SubMenu[] | undefined {
    if (!subMenus) return undefined;

    const filtered = subMenus.filter((sub) => this.hasAccess(sub.requiredCapability));

    return filtered.length ? filtered : undefined;
  }

  externalUrlToNavigateToNow = signal<string>('');

  loading = this.genericDashboardService.loading;

  isMenuActive(intendedPath: string) {
    const currentPath = this.router.url.split('/');

    const pageRendered = currentPath[currentPath.length - 1];

    return intendedPath.endsWith(pageRendered);
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

  isWorkspaceActive = signal(false);

  onRouteActivate(component: any) {
    // Check if the component being loaded into the outlet is the Workspace
    this.isWorkspaceActive.set(component instanceof Workspace);
  }

  isSidebarClosed = computed(() => {
    return !this.sidebarService.open()
  })

  logout() {

  }
}
