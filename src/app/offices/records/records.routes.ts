import type { Routes } from '@angular/router';
import { Capabilities as C } from '../../platform/authorization/capabilities';
import { capabilityGuard } from '../../office-platform/guards/office-workbench.guard';
import { sharedOfficeRoutes } from '../../office-platform/routes/shared-office.routes';

const page = (title: string, description: string, capabilities: string[] = []) => ({
  loadComponent: () => import('../../office-platform/pages/workbench-page/workbench-page').then((m) => m.WorkbenchPage),
  canActivate: capabilities.length ? [capabilityGuard(...capabilities)] : [],
  data: { title, description },
});

export const RECORDS_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'overview' },
  { path: 'overview', ...page('Records & Registry', 'Control official correspondence from intake through archival and disposition.') },
  ...sharedOfficeRoutes,
  { path: 'intake', ...page('Document intake', 'Scan, upload, validate and register incoming correspondence.', [C.Record.Register, C.Record.Archive]) },
  { path: 'incoming-register', ...page('Incoming register', 'Review and track every item formally received by the organisation.', [C.Record.View, C.Record.Archive]) },
  { path: 'outgoing-register', ...page('Outgoing register', 'Control dispatch, acknowledgement and delivery evidence.', [C.Record.View, C.Record.Archive]) },
  { path: 'classification', ...page('Classification & indexing', 'Apply business classifications, subjects and searchable metadata.', [C.Record.Classify]) },
  { path: 'routing', ...page('Routing & distribution', 'Route registered items to the responsible offices and track receipt.', [C.Record.Route, C.Workflow.Forward]) },
  { path: 'repository', ...page('Records repository', 'Search and retrieve official active and closed records.', [C.Record.View, C.Record.Archive]) },
  { path: 'archives', ...page('Archives', 'Manage archival custody and access to declared records.', [C.Record.Archive]) },
  { path: 'retention', ...page('Retention & disposition', 'Review retention schedules and controlled disposition actions.', [C.Record.Archive, C.Record.Dispose]) },
  { path: 'audit-trail', ...page('Registry audit trail', 'Inspect accountable records activity and custody changes.', [C.Audit.View, C.Record.Archive]) },
];
