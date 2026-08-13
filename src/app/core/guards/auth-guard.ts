import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../../features/auth/service/auth-service';
import { CurrentStaffService } from '../../features/shared/services/current-staff/current-staff-service';
import type { AppError } from '../../models/ui/global/ErrorPresentation.ui';

export const authGuard: CanActivateFn = async (_route, state) => {
  const authService = inject(AuthService);
  const currentStaffService = inject(CurrentStaffService);
  const router = inject(Router);

  const firebaseUser = await authService.waitForUser();

  if (!firebaseUser) {
    authService.endSecureEnvironmentSetup();
    return router.createUrlTree(['/auth'], {
      queryParams: {
        returnUrl: state.url,
      },
    });
  }

  const needsIdentityBootstrap = !currentStaffService.data();
  if (needsIdentityBootstrap) authService.beginSecureEnvironmentSetup();

  try {
    if (needsIdentityBootstrap) {
      await currentStaffService.loadCurrentStaff();
    }

    return true;
  } catch (error) {
    const appError = error as AppError;
    const category = appError.apiError?.context.category;

    if (category === 'authorization' || category === 'not_found') {
      return router.createUrlTree(['/unauthorized']);
    }

    if (category === 'authentication') {
      await authService.logout();

      return router.createUrlTree(['/auth'], {
        queryParams: {
          returnUrl: state.url,
        },
      });
    }

    return router.createUrlTree(['/system-error']);
  } finally {
    authService.endSecureEnvironmentSetup();
  }
};
