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
          import('./pages/dashboard/desk/staff/staff-desk/staff-desk').then((m) => m.StaffDesk),
      },
      {
        path: 'documents',
        loadComponent: () =>
          import('./pages/dashboard/documents/staff-documents/staff-documents').then(
            (m) => m.StaffDocuments,
          ),
      },
      {
        path: 'documents/workspace/:id',
        loadComponent: () => import('./pages/dashboard/workspace/workspace').then((comp) => comp.Workspace)
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
