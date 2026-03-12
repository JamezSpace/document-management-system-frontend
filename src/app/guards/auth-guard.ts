import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/page-wide/auth/auth-service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = await authService.waitForUser();
  console.log("user", user);
  

  return !!user || router.createUrlTree(['/unauthorized']);
};
