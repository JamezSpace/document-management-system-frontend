import type { Routes } from '@angular/router';
import { Capabilities as C } from '../../platform/authorization/capabilities';
import { capabilityGuard } from '../guards/office-workbench.guard';

export const sharedOfficeRoutes: Routes = [
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
];
