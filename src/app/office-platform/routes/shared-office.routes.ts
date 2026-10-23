import type { Routes } from '@angular/router';
import { Capabilities as C } from '../../platform/authorization/capabilities';
import { capabilityGuard } from '../guards/office-workbench.guard';

const sharedOfficeRoutes: Routes = [
  {
    path: 'work-queue',
    canActivate: [capabilityGuard(C.Workflow.View, C.Workflow.Forward)],
    loadComponent: () =>
      import('../../features/work-management/pages/task-ledger/tasks-ledger').then(
        (page) => page.TasksLedger,
      ),
  },
  {
    path: 'assigned-documents',
    canActivate: [capabilityGuard(C.Document.View)],
    loadComponent: () =>
      import('../../features/work-management/pages/assigned-documents/assigned-documents').then(
        (page) => page.AssignedDocuments,
      ),
  },
  {
    path: 'returned',
    canActivate: [capabilityGuard(C.Document.View)],
    loadComponent: () =>
      import('../../features/work-management/pages/returned-work/returned-work').then(
        (page) => page.ReturnedWork,
      ),
  },
  {
    path: 'completed',
    canActivate: [capabilityGuard(C.Document.View)],
    loadComponent: () =>
      import('../../features/work-management/pages/completed-work/completed-work').then(
        (page) => page.CompletedWork,
      ),
  },
  {
    path: 'documents',
    canActivate: [capabilityGuard(C.Document.View)],
    loadComponent: () => import('../../features/documents/page/document-registry').then((page) => page.DocumentRegistry),
  },
  {
    path: 'documents/workspace/:id',
    canActivate: [capabilityGuard(C.Document.View)],
    loadComponent: () => import('../../features/workspace/page/workspace').then((page) => page.Workspace),
  },
  {
    path: 'notices',
    canActivate: [capabilityGuard(C.Notice.View)],
    loadComponent: () => import('../../pages/dashboard/staff/general/notices/notices').then((page) => page.Notices),
  },
  {
    path: 'settings',
    loadComponent: () => import('../pages/account-settings/account-settings').then((page) => page.AccountSettings),
  },
];

export { sharedOfficeRoutes };
