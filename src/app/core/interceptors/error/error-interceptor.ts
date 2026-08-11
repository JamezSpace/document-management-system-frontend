import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ErrorPresenterService } from '../../services/error/presenter/error-presenter';
import { ErrorMapperService } from '../../services/error/mapper/error-mapper';
import { catchError, throwError } from 'rxjs';
import { ERROR_SURFACE, SKIP_ERROR_PRESENTATION } from './error-context';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const mapper = inject(ErrorMapperService);
  const presenter = inject(ErrorPresenterService);

  return next(request).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }

      const appError = mapper.map(error, request.context.get(ERROR_SURFACE));

      if (!request.context.get(SKIP_ERROR_PRESENTATION)){
        presenter.present(appError);
      }

      // feature services receive the normalized AppError.
      return throwError(() => appError);
    }),
  );
};
