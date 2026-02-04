import { Routes } from '@angular/router';
import { Auth } from './pages/auth/auth';
import { Onboarding } from './pages/onboarding/onboarding';
import { DocumentsVault } from './pages/dashboard/document-workspace/admin/documents-vault/documents-vault';
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
          import('./pages/dashboard/document-workspace/staff/staff-documents/staff-documents').then(
            (m) => m.StaffDocuments,
          ),
      },
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
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
