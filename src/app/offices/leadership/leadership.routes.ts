import type { Routes } from '@angular/router';
import { sharedOfficeRoutes } from '../../office-platform/routes/shared-office.routes';
import { capabilityGuard } from '../../office-platform/guards/office-workbench.guard';
import { Capabilities as C } from '../../platform/authorization/capabilities';

const page = (title: string, description: string) => ({
  loadComponent: () => import('../../office-platform/pages/workbench-page/workbench-page').then((m) => m.WorkbenchPage),
  data: { title, description },
});

export const LEADERSHIP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'overview' },
  { path: 'overview', ...page('Leadership & Approvals', 'Make accountable decisions, issue direction and oversee office execution.') },
  ...sharedOfficeRoutes,
  {
    path: 'approvals',
    canActivate: [capabilityGuard(C.Document.Approve, C.Document.Sign)],
    loadComponent: () => import('../../pages/dashboard/staff/operations/cio/sensitivity-approvals/sensitivity-approvals').then((m) => m.SensitivityApprovals),
  },
  { path: 'signature-queue', canActivate: [capabilityGuard(C.Document.Sign)], ...page('Signature queue', 'Approved instruments ready for authorised signature.') },
  { path: 'escalations', canActivate: [capabilityGuard(C.Workflow.Escalate, C.Directive.Issue)], ...page('Escalations', 'Exceptional and overdue matters requiring leadership intervention.') },
  { path: 'unit-control', canActivate: [capabilityGuard(C.Directive.Issue)], loadComponent: () => import('../../pages/dashboard/staff/operations/cio/unit-control/unit-control').then((m) => m.UnitControl) },
  { path: 'directives', canActivate: [capabilityGuard(C.Directive.View)], loadComponent: () => import('../../pages/dashboard/staff/operations/cio/directives-log/directives-log').then((m) => m.DirectivesLog) },
  { path: 'workload', canActivate: [capabilityGuard(C.Directive.View)], ...page('Office workload', 'Monitor assignments, bottlenecks and overdue work across the office.') },
  { path: 'audit-trail', canActivate: [capabilityGuard(C.Audit.View, C.Directive.View)], ...page('Decision audit trail', 'Review approvals, returns, signatures and issued directives.') },
];
