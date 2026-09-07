import type { Routes } from '@angular/router';
import { sharedOfficeRoutes } from '../../office-platform/routes/shared-office.routes';
import { capabilityGuard } from '../../office-platform/guards/office-workbench.guard';
import { Capabilities as C } from '../../platform/authorization/capabilities';

export const LEADERSHIP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'overview' },
  {
    path: 'overview',
    loadComponent: () =>
      import('./pages/leadership-overview/leadership-overview').then(
        (page) => page.LeadershipOverview,
      ),
  },
  ...sharedOfficeRoutes,
  {
    path: 'approvals',
    canActivate: [capabilityGuard(C.Document.Approve, C.Document.Sign)],
    loadComponent: () => import('../../pages/dashboard/staff/operations/cio/sensitivity-approvals/sensitivity-approvals').then((m) => m.SensitivityApprovals),
  },
  {
    path: 'signature-queue',
    canActivate: [capabilityGuard(C.Document.Sign)],
    loadComponent: () =>
      import('./pages/signature-queue/signature-queue').then((page) => page.SignatureQueue),
  },
  {
    path: 'escalations',
    canActivate: [capabilityGuard(C.Workflow.Escalate, C.Directive.Issue)],
    loadComponent: () =>
      import('./pages/escalations/escalations').then((page) => page.Escalations),
  },
  { path: 'unit-control', canActivate: [capabilityGuard(C.Directive.Issue)], loadComponent: () => import('../../pages/dashboard/staff/operations/cio/unit-control/unit-control').then((m) => m.UnitControl) },
  { path: 'directives', canActivate: [capabilityGuard(C.Directive.View)], loadComponent: () => import('../../pages/dashboard/staff/operations/cio/directives-log/directives-log').then((m) => m.DirectivesLog) },
  {
    path: 'workload',
    canActivate: [capabilityGuard(C.Directive.View)],
    loadComponent: () =>
      import('./pages/office-workload/office-workload').then((page) => page.OfficeWorkload),
  },
  {
    path: 'audit-trail',
    canActivate: [capabilityGuard(C.Audit.View, C.Directive.View)],
    loadComponent: () =>
      import('./pages/decision-audit-trail/decision-audit-trail').then(
        (page) => page.DecisionAuditTrail,
      ),
  },
];
