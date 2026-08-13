import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { OfficeContextService } from '../context/office-context.service';
import type { OfficeWorkbenchKey } from '../models/office-workbench';

export const officeLandingGuard: CanActivateFn = () => {
  const officeContext = inject(OfficeContextService);
  const router = inject(Router);
  const active = officeContext.active();

  return active
    ? router.createUrlTree(['/office', active.workbench, active.definition.landingRoute])
    : router.createUrlTree(['/unauthorized']);
};

export const officeWorkbenchGuard = (workbench: OfficeWorkbenchKey): CanMatchFn => () => {
  const officeContext = inject(OfficeContextService);
  const router = inject(Router);

  if (officeContext.canEnter(workbench)) return true;

  const active = officeContext.active();
  return active
    ? router.createUrlTree(['/office', active.workbench, active.definition.landingRoute])
    : router.createUrlTree(['/unauthorized']);
};

export const capabilityGuard = (...capabilities: string[]): CanActivateFn => () => {
  const officeContext = inject(OfficeContextService);
  const router = inject(Router);

  return capabilities.length === 0 || officeContext.hasAny(capabilities)
    ? true
    : router.createUrlTree(['/unauthorized']);
};
