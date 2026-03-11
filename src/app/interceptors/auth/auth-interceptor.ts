import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/page-wide/auth/auth-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    let reqWithBearerToken = req;

    if(authService.accessToken())
        reqWithBearerToken = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${authService.accessToken()}`)
        })

    return next(reqWithBearerToken);
};
