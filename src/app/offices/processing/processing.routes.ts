import type { Routes } from '@angular/router';
import { sharedOfficeRoutes } from '../../office-platform/routes/shared-office.routes';
import { capabilityGuard } from '../../office-platform/guards/office-workbench.guard';
import { Capabilities as C } from '../../platform/authorization/capabilities';

const page = (title: string, description: string) => ({
  loadComponent: () => import('../../office-platform/pages/workbench-page/workbench-page').then((m) => m.WorkbenchPage),
  data: { title, description },
});

export const PROCESSING_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'overview' },
  { path: 'overview', ...page('Processing', 'Work assigned documents from receipt through review, recommendation and completion.') },
  ...sharedOfficeRoutes,
  { path: 'work-queue', canActivate: [capabilityGuard(C.Workflow.View, C.Workflow.Forward)], loadComponent: () => import('../../pages/dashboard/staff/operations/regular/tasks-ledger/tasks-ledger').then((m) => m.TasksLedger) },
  { path: 'assigned-documents', canActivate: [capabilityGuard(C.Document.View)], ...page('Assigned documents', 'Documents currently assigned to you or your team.') },
  { path: 'reviews', canActivate: [capabilityGuard(C.Document.View)], ...page('Reviews & minutes', 'Review content and record recommendations or minutes.') },
  { path: 'returned', canActivate: [capabilityGuard(C.Document.View)], ...page('Returned work', 'Items returned for correction or additional information.') },
  { path: 'escalated', canActivate: [capabilityGuard(C.Workflow.View, C.Workflow.Escalate)], ...page('Escalated items', 'Time-sensitive and exceptional items requiring attention.') },
  { path: 'completed', canActivate: [capabilityGuard(C.Document.View)], ...page('Completed work', 'A history of work completed by this office.') },
];
