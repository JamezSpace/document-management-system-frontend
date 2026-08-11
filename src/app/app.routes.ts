import { Routes } from '@angular/router';
import { Auth } from './features/auth/page/auth';
import { DashboardOfficeTemplate } from './pages/dashboard/shared/dashboard-office-template/dashboard-office-template';
import { authGuard } from './core/guards/auth-guard';
import { Unauthorized } from './pages/shared/unauthorized/unauthorized/unauthorized';
import { OnboardingEntity } from './features/onboarding/pages/onboarding-entity/onboarding-entity';
import { PasswordReset } from './features/onboarding/pages/password-reset/password-reset';

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
    path: ':entityType/onboarding',
    component: OnboardingEntity,
  },

  // staff password reset
  {
    path: 'staff/passwordReset',
    component: PasswordReset,
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
          import('./features/documents/page/document-registry').then((page) => page.DocumentRegistry),
      },
      {
        path: 'documents/workspace/:id',
        loadComponent: () =>
          import('./features/workspace/page/workspace').then((page) => page.Workspace),
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
      {
        path: 'operations/staff-activation',
        loadComponent: () =>
          import('./pages/dashboard/staff/operations/hr/staff-activation/staff-activation').then(
            (page) => page.StaffActivation,
          ),
      },
    ],
  },

  // unauthorized
  {
    path: 'unauthorized',
    component: Unauthorized
  },

  //fallback
    {
        path: '404',
        loadComponent: () => import('./pages/shared/not-found/not-found').then((m) => m.NotFound),
    },
    {
        path: '**',
        redirectTo: '404',
    },
];
