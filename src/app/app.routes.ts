import { Routes } from '@angular/router';
import { Auth } from './features/auth/page/auth';
import { authGuard } from './core/guards/auth-guard';
import { Unauthorized } from './pages/shared/unauthorized/unauthorized/unauthorized';
import { OnboardingEntity } from './features/onboarding/pages/onboarding-entity/onboarding-entity';
import { PasswordReset } from './features/onboarding/pages/password-reset/password-reset';
import { OfficeShell } from './office-platform/shell/office-shell';
import {
  officeLandingGuard,
  officeWorkbenchGuard,
} from './office-platform/guards/office-workbench.guard';

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
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: OfficeShell,
        canActivate: [officeLandingGuard],
      },
      {
        path: 'records',
        component: OfficeShell,
        canActivate: [officeWorkbenchGuard('records')],
        loadChildren: () => import('./offices/records/records.routes').then((m) => m.RECORDS_ROUTES),
      },
      {
        path: 'secretariat',
        component: OfficeShell,
        canActivate: [officeWorkbenchGuard('secretariat')],
        loadChildren: () => import('./offices/secretariat/secretariat.routes').then((m) => m.SECRETARIAT_ROUTES),
      },
      {
        path: 'processing',
        component: OfficeShell,
        canActivate: [officeWorkbenchGuard('processing')],
        loadChildren: () => import('./offices/processing/processing.routes').then((m) => m.PROCESSING_ROUTES),
      },
      {
        path: 'leadership',
        component: OfficeShell,
        canActivate: [officeWorkbenchGuard('leadership')],
        loadChildren: () => import('./offices/leadership/leadership.routes').then((m) => m.LEADERSHIP_ROUTES),
      },
      {
        path: 'human-resources',
        component: OfficeShell,
        canActivate: [officeWorkbenchGuard('human-resources')],
        loadChildren: () => import('./offices/human-resources/human-resources.routes').then((m) => m.HUMAN_RESOURCES_ROUTES),
      },
      {
        path: 'system-administration',
        component: OfficeShell,
        canActivate: [officeWorkbenchGuard('system-administration')],
        loadChildren: () => import('./offices/system-administration/system-administration.routes').then((m) => m.SYSTEM_ADMINISTRATION_ROUTES),
      },
      {
        path: 'audit-compliance',
        component: OfficeShell,
        canActivate: [officeWorkbenchGuard('audit-compliance')],
        loadChildren: () => import('./offices/audit-compliance/audit-compliance.routes').then((m) => m.AUDIT_COMPLIANCE_ROUTES),
      },
    ],
  },

  // unauthorized
  {
    path: 'unauthorized',
    component: Unauthorized
  },
  {
    path: 'system-error',
    loadComponent: () =>
      import('./pages/shared/system-error/system-error').then((m) => m.SystemError),
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
