import { Routes } from '@angular/router';
import { Auth } from './pages/auth/auth';
import { DashboardOfficeTemplate } from './pages/dashboard/shared/dashboard-office-template/dashboard-office-template';
import { Onboarding } from './pages/onboarding/onboarding';

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
            (comp) => comp.Workspace,
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
