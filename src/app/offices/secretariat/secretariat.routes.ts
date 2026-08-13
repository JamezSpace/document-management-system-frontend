import type { Routes } from '@angular/router';
import { sharedOfficeRoutes } from '../../office-platform/routes/shared-office.routes';
import { capabilityGuard } from '../../office-platform/guards/office-workbench.guard';
import { Capabilities as C } from '../../platform/authorization/capabilities';

const page = (title: string, description: string, capabilities: string[] = []) => ({
  loadComponent: () => import('../../office-platform/pages/workbench-page/workbench-page').then((m) => m.WorkbenchPage),
  canActivate: capabilities.length ? [capabilityGuard(...capabilities)] : [],
  data: { title, description },
});

export const SECRETARIAT_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'overview' },
  { path: 'overview', ...page('Secretariat', 'Coordinate executive correspondence, attention, signatures, meetings and follow-through.') },
  ...sharedOfficeRoutes,
  { path: 'executive-inbox', ...page('Executive inbox', 'Correspondence received for executive attention.', [C.Document.View]) },
  { path: 'correspondence-register', ...page('Correspondence register', 'The working register for executive correspondence.', [C.Document.View]) },
  { path: 'attention-queue', ...page('Attention queue', 'Items awaiting briefing, review or executive action.', [C.Workflow.Forward]) },
  { path: 'drafts', ...page('Drafts & briefs', 'Prepare official letters, memos, briefs and supporting notes.', [C.Document.Create]) },
  { path: 'signature-queue', ...page('Signature queue', 'Documents prepared and verified for signature.', [C.Document.Sign, C.Workflow.Forward]) },
  { path: 'meetings', ...page('Meetings', 'Coordinate executive meetings and appointments.') },
  { path: 'minutes', ...page('Minutes & action items', 'Record decisions and follow each assigned action to completion.') },
  { path: 'dispatch', ...page('Dispatch tracking', 'Track signed outgoing correspondence through delivery.', [C.Workflow.Forward]) },
  { path: 'executive-archive', ...page('Executive archive', 'Retrieve the executive office’s working correspondence history.', [C.Document.View]) },
];
