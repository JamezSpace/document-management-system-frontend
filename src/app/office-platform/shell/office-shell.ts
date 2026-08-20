import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArchive,
  lucideArchiveRestore,
  lucideAward,
  lucideBadgeCheck,
  lucideBell,
  lucideBookOpen,
  lucideBriefcaseBusiness,
  lucideCalendarCheck,
  lucideCalendarClock,
  lucideCalendarDays,
  lucideChartNoAxesCombined,
  lucideCircleCheckBig,
  lucideClipboardCheck,
  lucideClipboardList,
  lucideFileCog,
  lucideFilePenLine,
  lucideFileSearch,
  lucideFiles,
  lucideHistory,
  lucideInbox,
  lucideLayoutDashboard,
  lucideLibrary,
  lucideListTodo,
  lucideLogOut,
  lucideMessageSquareText,
  lucideNetwork,
  lucidePenTool,
  lucidePlugZap,
  lucideRoute,
  lucideScanLine,
  lucideSend,
  lucideSettings,
  lucideShieldCheck,
  lucideTags,
  lucideTriangleAlert,
  lucideUndo2,
  lucideUserCheck,
  lucideUsers,
  lucideWorkflow,
  lucideZap,
} from '@ng-icons/lucide';
import { BrnAlertDialogContent, BrnAlertDialogTrigger } from '@spartan-ng/brain/alert-dialog';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmSidebarImports, HlmSidebarService } from '@spartan-ng/helm/sidebar';
import { AuthService } from '../../features/auth/service/auth-service';
import { CurrentStaffService } from '../../features/shared/services/current-staff/current-staff-service';
import { Workspace } from '../../features/workspace/page/workspace';
import type { OfficeNavigationGroup } from '../models/office-navigation';
import { OfficeContextService } from '../context/office-context.service';
import { OfficeActivityService } from '../activity/office-activity.service';
import { LineLoader } from '../../shared/components/loaders/line-loader/line-loader';

@Component({
  selector: 'nexus-office-shell',
  imports: [
    RouterOutlet,
    RouterLink,
    NgIcon,
    HlmIcon,
    HlmSidebarImports,
    HlmAvatarImports,
    HlmButtonImports,
    HlmAlertDialogImports,
    HlmSeparator,
    LineLoader,
    BrnAlertDialogContent,
    BrnAlertDialogTrigger,
  ],
  templateUrl: './office-shell.html',
  styleUrl: './office-shell.css',
  providers: [provideIcons({
    lucideArchive, lucideArchiveRestore, lucideAward, lucideBadgeCheck, lucideBell,
    lucideBookOpen, lucideBriefcaseBusiness, lucideCalendarCheck, lucideCalendarClock,
    lucideCalendarDays, lucideChartNoAxesCombined, lucideCircleCheckBig, lucideClipboardCheck,
    lucideClipboardList, lucideFileCog, lucideFilePenLine, lucideFileSearch, lucideFiles,
    lucideHistory, lucideInbox, lucideLayoutDashboard, lucideLibrary,
    lucideListTodo, lucideLogOut, lucideMessageSquareText, lucideNetwork, lucidePenTool,
    lucidePlugZap, lucideRoute, lucideScanLine, lucideSend, lucideSettings, lucideShieldCheck,
    lucideTags, lucideTriangleAlert, lucideUndo2, lucideUserCheck, lucideUsers,
    lucideWorkflow, lucideZap,
  })],
})
export class OfficeShell {
  private readonly authService = inject(AuthService);
  private readonly staffService = inject(CurrentStaffService);
  private readonly sidebarService = inject(HlmSidebarService);
  private readonly router = inject(Router);
  readonly officeContext = inject(OfficeContextService);
  readonly activity = inject(OfficeActivityService);

  readonly staff = this.staffService.data;
  readonly context = this.officeContext.active;
  readonly workspaceActive = signal(false);
  readonly sidebarClosed = computed(() => !this.sidebarService.open());

  readonly navigation = computed<OfficeNavigationGroup[]>(() => {
    const definition = this.context()?.definition;
    if (!definition) return [];

    return definition.navigation
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          if (item.capability && this.officeContext.has(item.capability)) return true;
          if (item.anyCapabilities?.length && this.officeContext.hasAny(item.anyCapabilities)) return true;
          return !item.capability && !item.anyCapabilities?.length;
        }),
      }))
      .filter((group) => group.items.length > 0);
  });

  isActive(route: string): boolean {
    const currentPath = this.router.url.split(/[?#]/, 1)[0].replace(/\/$/, '');
    const targetPath = `${this.officeContext.baseRoute()}/${route}`.replace(/\/$/, '');

    return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
  }

  onRouteActivate(component: unknown): void {
    this.workspaceActive.set(component instanceof Workspace);
  }

  initials(fullName: string): string {
    return fullName.split(/\s+/).filter(Boolean).map((name) => name[0]).join('').slice(0, 2);
  }

  async logout(): Promise<void> {
    this.staffService.resetContext();
    await this.authService.logout();
  }
}
