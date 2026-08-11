import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { AuthService } from '../../../features/auth/service/auth-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return from(authService.getValidToken()).pipe(
    switchMap((token) => {
      const authReq = token
        ? req.clone({ 
            setHeaders: { Authorization: `Bearer ${token}` }, 
            // withCredentials: true
         })
        : req;
      return next(authReq);
    }),
  );
};
