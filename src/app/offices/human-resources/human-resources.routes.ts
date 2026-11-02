import type { Routes } from '@angular/router';
import { sharedOfficeRoutes } from '../../office-platform/routes/shared-office.routes';
import { capabilityGuard } from '../../office-platform/guards/office-workbench.guard';
import { Capabilities as C } from '../../platform/authorization/capabilities';
const HUMAN_RESOURCES_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'overview' },
  {
    path: 'overview',
    loadComponent: () => import('./pages/hr-overview/hr-overview').then((m) => m.HrOverview),
  },
  ...sharedOfficeRoutes,
  {
    path: 'staff',
    canActivate: [capabilityGuard(C.Staff.List)],
    loadComponent: () =>
      import('./pages/staff-administration/staff-administration').then(
        (m) => m.StaffAdministration,
      ),
  },
  {
    path: 'identity-change-review',
    canActivate: [capabilityGuard(C.Identity.ChangeReview)],
    loadComponent: () =>
      import('./pages/identity-change-review/identity-change-review').then(
        (m) => m.IdentityChangeReview,
      ),
  },
  { path: 'staff-activation', canActivate: [capabilityGuard(C.Staff.Activate)], loadComponent: () => import('../../pages/dashboard/staff/operations/hr/staff-activation/staff-activation').then((m) => m.StaffActivation) },
  {
    path: 'personnel-files',
    canActivate: [capabilityGuard(C.Staff.View)],
    loadComponent: () => import('./pages/personnel-files/personnel-files').then((m) => m.PersonnelFiles),
  },
  {
    path: 'leave',
    canActivate: [capabilityGuard(C.Staff.Update)],
    loadComponent: () => import('./pages/leave-management/leave-management').then((m) => m.LeaveManagement),
  },
  {
    path: 'appointments',
    canActivate: [capabilityGuard(C.Staff.Update)],
    loadComponent: () => import('./pages/appointments-promotions/appointments-promotions').then((m) => m.AppointmentsPromotions),
  },
  {
    path: 'establishment',
    canActivate: [capabilityGuard(C.Staff.Create)],
    loadComponent: () => import('./pages/establishment/establishment').then((m) => m.Establishment),
  },
  {
    path: 'reports',
    canActivate: [capabilityGuard(C.Staff.View)],
    loadComponent: () => import('./pages/hr-reports/hr-reports').then((m) => m.HrReports),
  },
];

export { HUMAN_RESOURCES_ROUTES };
