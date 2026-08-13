import type { Routes } from '@angular/router';
import { sharedOfficeRoutes } from '../../office-platform/routes/shared-office.routes';

const page = (title: string, description: string) => ({
  loadComponent: () => import('../../office-platform/pages/workbench-page/workbench-page').then((m) => m.WorkbenchPage),
  data: { title, description },
});

export const AUDIT_COMPLIANCE_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'overview' },
  { path: 'overview', ...page('Audit & Compliance', 'Conduct independent, accountable oversight of access and records activity.') },
  ...sharedOfficeRoutes,
  { path: 'document-audit', ...page('Document audit', 'Inspect document history, decisions and custody evidence.') },
  { path: 'workflow-audit', ...page('Workflow audit', 'Review assignment, forwarding, return and escalation history.') },
  { path: 'access-audit', ...page('Access audit', 'Review scoped access, role assignments and delegations.') },
  { path: 'retention-review', ...page('Retention review', 'Assess compliance with approved retention schedules.') },
  { path: 'disposition-review', ...page('Disposition review', 'Review disposition eligibility and authorisation evidence.') },
  { path: 'reports', ...page('Compliance reports', 'Prepare controlled oversight findings and reports.') },
];
