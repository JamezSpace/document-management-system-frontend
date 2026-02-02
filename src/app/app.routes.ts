import { Routes } from '@angular/router';
import { Auth } from './pages/auth/auth';
import { Onboarding } from './pages/onboarding/onboarding';
import { StaffDesk } from './pages/dashboard/staff/staff-desk/staff-desk';
import { DocumentsVault } from './pages/dashboard/staff/documents-vault/documents-vault';
import { DashboardOfficeTemplate } from './pages/dashboard/shared/dashboard-office-template/dashboard-office-template';

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
        redirectTo: 'desk',
        pathMatch: 'full',
      },
      {
        path: 'desk',
        loadComponent: () =>
          import('./pages/dashboard/staff/staff-desk/staff-desk').then((m) => m.StaffDesk),
      },
      {
        path: 'vault', // The "Google Drive" style file manager
        loadComponent: () =>
          import('./pages/dashboard/staff/documents-vault/documents-vault').then(
            (m) => m.DocumentsVault,
          ),
      },
      {
        path: '',
        redirectTo: 'desk',
        pathMatch: 'full',
      },
    ],
  },

  // fallback
  {
    path: '404',
    loadComponent: () => import('./pages/shared/not-found/not-found').then((m) => m.NotFound),
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
