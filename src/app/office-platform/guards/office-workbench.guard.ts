import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
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

/** Runs after the parent auth guard has restored the staff context on page refresh. */
export const officeWorkbenchGuard = (workbench: OfficeWorkbenchKey): CanActivateFn => () => {
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
