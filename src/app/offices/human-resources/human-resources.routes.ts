import type { Routes } from '@angular/router';
import { sharedOfficeRoutes } from '../../office-platform/routes/shared-office.routes';
import { capabilityGuard } from '../../office-platform/guards/office-workbench.guard';
import { Capabilities as C } from '../../platform/authorization/capabilities';

const page = (title: string, description: string) => ({
  loadComponent: () => import('../../office-platform/pages/workbench-page/workbench-page').then((m) => m.WorkbenchPage),
  data: { title, description },
});

export const HUMAN_RESOURCES_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'overview' },
  { path: 'overview', ...page('Human Resources', 'Manage people, personnel records, establishment and employee lifecycle actions.') },
  ...sharedOfficeRoutes,
  { path: 'staff', canActivate: [capabilityGuard(C.Staff.View)], loadComponent: () => import('../../pages/dashboard/staff/operations/hr/staff-registry/staff-registry').then((m) => m.StaffRegistry) },
  { path: 'staff-activation', canActivate: [capabilityGuard(C.Staff.Activate)], loadComponent: () => import('../../pages/dashboard/staff/operations/hr/staff-activation/staff-activation').then((m) => m.StaffActivation) },
  { path: 'personnel-files', canActivate: [capabilityGuard(C.Staff.View)], ...page('Personnel files', 'Securely manage official staff records and employment history.') },
  { path: 'leave', canActivate: [capabilityGuard(C.Staff.Update)], ...page('Leave management', 'Review, approve and track staff leave.') },
  { path: 'appointments', canActivate: [capabilityGuard(C.Staff.Update)], ...page('Appointments & promotions', 'Manage appointment and promotion exercises.') },
  { path: 'establishment', canActivate: [capabilityGuard(C.Staff.Create)], ...page('Establishment', 'Maintain approved offices, designations and staffing positions.') },
  { path: 'reports', canActivate: [capabilityGuard(C.Staff.View)], ...page('HR reports', 'Review workforce and establishment information.') },
];
