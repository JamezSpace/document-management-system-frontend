import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/page-wide/auth/auth-service';
import { from, switchMap } from 'rxjs';

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
