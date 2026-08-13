import type { Routes } from '@angular/router';
import { sharedOfficeRoutes } from '../../office-platform/routes/shared-office.routes';

const page = (title: string, description: string) => ({
  loadComponent: () => import('../../office-platform/pages/workbench-page/workbench-page').then((m) => m.WorkbenchPage),
  data: { title, description },
});

export const SYSTEM_ADMINISTRATION_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'overview' },
  { path: 'overview', ...page('System Administration', 'Configure organisation structure, authorisation, workflows and platform policy.') },
  ...sharedOfficeRoutes,
  { path: 'organization', ...page('Organisation structure', 'Manage units, offices, designations and their workbench assignments.') },
  { path: 'access', ...page('Roles & capabilities', 'Manage scoped roles, capabilities, assignments and delegations.') },
  { path: 'document-configuration', ...page('Document configuration', 'Configure document types, subjects and business functions.') },
  { path: 'workflow-configuration', ...page('Workflow configuration', 'Configure routing, review and approval policies.') },
  { path: 'retention-configuration', ...page('Retention policies', 'Configure records retention and disposition rules.') },
  { path: 'integrations', ...page('Integrations', 'Manage approved external services and platform connections.') },
  { path: 'system-audit', ...page('System audit', 'Review administrative and security-sensitive platform changes.') },
];
