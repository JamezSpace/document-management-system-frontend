import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ErrorPresenterService } from '../../services/error/presenter/error-presenter';
import { ErrorMapperService } from '../../services/error/mapper/error-mapper';
import { catchError, from, mergeMap, throwError } from 'rxjs';
import { ERROR_SURFACE, SKIP_ERROR_PRESENTATION } from './error-context';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const mapper = inject(ErrorMapperService);
  const presenter = inject(ErrorPresenterService);

  return next(request).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }

      const presentAndThrow = (httpError: HttpErrorResponse) => {
        const appError = mapper.map(httpError, request.context.get(ERROR_SURFACE));

        if (!request.context.get(SKIP_ERROR_PRESENTATION)) {
          presenter.present(appError);
        }

        return throwError(() => appError);
      };

      // Blob endpoints still return the normal JSON error envelope on failure.
      if (error.error instanceof Blob && error.error.type.includes('json')) {
        return from(error.error.text()).pipe(
          mergeMap((body) => {
            let parsedBody: unknown = body;
            try {
              parsedBody = JSON.parse(body);
            } catch {
              // The mapper will fall back to the standard unexpected-error presentation.
            }

            return presentAndThrow(new HttpErrorResponse({
              error: parsedBody,
              headers: error.headers,
              status: error.status,
              statusText: error.statusText,
              url: error.url ?? undefined,
            }));
          }),
        );
      }

      // Feature services receive the normalized AppError.
      return presentAndThrow(error);
    }),
  );
};
