import type { Routes } from '@angular/router';
import { Capabilities as C } from '../../platform/authorization/capabilities';
import { capabilityGuard } from '../../office-platform/guards/office-workbench.guard';
import { sharedOfficeRoutes } from '../../office-platform/routes/shared-office.routes';
const RECORDS_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'overview' },
  { path: 'overview', loadComponent: () => import('./pages/records-overview/records-overview').then((page) => page.RecordsOverview) },
  ...sharedOfficeRoutes,
  { path: 'intake', canActivate: [capabilityGuard(C.Record.Register, C.Record.Archive)], loadComponent: () => import('./pages/document-intake/document-intake').then((page) => page.DocumentIntake) },
  { path: 'incoming-register', canActivate: [capabilityGuard(C.Record.View, C.Record.Archive)], loadComponent: () => import('./pages/incoming-register/incoming-register').then((page) => page.IncomingRegister) },
  { path: 'outgoing-register', canActivate: [capabilityGuard(C.Record.View, C.Record.Archive)], loadComponent: () => import('./pages/outgoing-register/outgoing-register').then((page) => page.OutgoingRegister) },
  { path: 'classification', canActivate: [capabilityGuard(C.Record.Classify)], loadComponent: () => import('./pages/classification-indexing/classification-indexing').then((page) => page.ClassificationIndexing) },
  { path: 'routing', canActivate: [capabilityGuard(C.Record.Route, C.Workflow.Forward)], loadComponent: () => import('./pages/routing-distribution/routing-distribution').then((page) => page.RoutingDistribution) },
  { path: 'repository', canActivate: [capabilityGuard(C.Record.View, C.Record.Archive)], loadComponent: () => import('./pages/records-repository/records-repository').then((page) => page.RecordsRepository) },
  { path: 'archives', canActivate: [capabilityGuard(C.Record.Archive)], loadComponent: () => import('./pages/archives/archives').then((page) => page.Archives) },
  { path: 'retention', canActivate: [capabilityGuard(C.Record.Archive, C.Record.Dispose)], loadComponent: () => import('./pages/retention-disposition/retention-disposition').then((page) => page.RetentionDisposition) },
  { path: 'audit-trail', canActivate: [capabilityGuard(C.Audit.View, C.Record.Archive)], loadComponent: () => import('./pages/registry-audit-trail/registry-audit-trail').then((page) => page.RegistryAuditTrail) },
];

export { RECORDS_ROUTES };
