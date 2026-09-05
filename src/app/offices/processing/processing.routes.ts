import type { Routes } from '@angular/router';
import { sharedOfficeRoutes } from '../../office-platform/routes/shared-office.routes';
import { capabilityGuard } from '../../office-platform/guards/office-workbench.guard';
import { Capabilities as C } from '../../platform/authorization/capabilities';
import type { ProcessingScreenKey } from './pages/overview/overview';

const page = (screen: ProcessingScreenKey, title: string, description: string) => ({
  loadComponent: () =>
    import('./pages/overview/overview').then((m) => m.Overview),
  data: { screen, title, description },
});

export const PROCESSING_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'overview' },
  {
    path: 'overview',
    ...page(
      'overview',
      'Processing',
      'Prioritise personal and unit workload from assignment through accountable completion.',
    ),
  },
  ...sharedOfficeRoutes,
  {
    path: 'reviews',
    canActivate: [capabilityGuard(C.Document.View)],
    loadComponent: () =>
      import('./pages/reviews-minutes/reviews-minutes').then((m) => m.ReviewsMinutes),
  },
  {
    path: 'escalated',
    canActivate: [capabilityGuard(C.Workflow.View, C.Workflow.Escalate)],
    ...page(
      'escalated',
      'Escalated items',
      'Resolve breached and high-attention work under the current accountable authority.',
    ),
  },
];
