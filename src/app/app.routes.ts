import { Routes } from '@angular/router';
import { Auth } from './pages/auth/auth';
import { DashboardOfficeTemplate } from './pages/dashboard/shared/dashboard-office-template/dashboard-office-template';
import { Onboarding } from './pages/onboarding/onboarding';
import { authGuard } from './guards/auth-guard';
import { Unauthorized } from './pages/shared/unauthorized/unauthorized/unauthorized';

export const routes: Routes = [
  // public/auth route
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    component: Auth,
  },

  // onboarding
  {
    path: ':entityType/onboarding/:entityId',
    component: Onboarding,
  },

  // digital office dashboard
  {
    path: 'office',
    component: DashboardOfficeTemplate,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./pages/dashboard/staff/general/overview/overview').then((page) => page.Overview),
      },
      {
        path: 'documents',
        loadComponent: () =>
          import('./pages/dashboard/staff/general/documents/documents').then(
            (page) => page.Documents,
          ),
      },
      {
        path: 'documents/workspace/:id',
        loadComponent: () =>
          import('./pages/dashboard/staff/general/workspace/workspace').then(
            (page) => page.Workspace,
          ),
      },
      {
        path: 'notices',
        loadComponent: () =>
          import('./pages/dashboard/staff/general/notices/notices').then((page) => page.Notices),
      },
      {
        path: 'operations/tasks',
        loadComponent: () =>
          import('./pages/dashboard/staff/operations/regular/tasks-ledger/tasks-ledger').then(
            (page) => page.TasksLedger,
          ),
      },
      {
        path: 'operations/unit-control',
        loadComponent: () =>
          import('./pages/dashboard/staff/operations/cio/unit-control/unit-control').then(
            (page) => page.UnitControl,
          ),
      },
      {
        path: 'operations/directives',
        loadComponent: () =>
          import('./pages/dashboard/staff/operations/cio/directives-log/directives-log').then(
            (page) => page.DirectivesLog,
          ),
      },
      {
        path: 'operations/staff',
        loadComponent: () =>
          import('./pages/dashboard/staff/operations/hr/staff-registry/staff-registry').then(
            (page) => page.StaffRegistry,
          ),
      },
    ],
  },

  // unauthorized
  {
    path: 'unauthorized',
    component: Unauthorized
  }
  // fallback
  //   {
  //     path: '404',
  //     loadComponent: () => import('./pages/shared/not-found/not-found').then((m) => m.NotFound),
  //   },
  //   {
  //     path: '**',
  //     redirectTo: '404',
  //   },
];
