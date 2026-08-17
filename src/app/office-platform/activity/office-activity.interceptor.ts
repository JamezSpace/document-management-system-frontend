import { inject } from '@angular/core';
import type { HttpInterceptorFn } from '@angular/common/http';
import { defer, finalize } from 'rxjs';
import { TRACK_OFFICE_ACTIVITY } from './office-activity.context';
import { OfficeActivityService } from './office-activity.service';

export const officeActivityInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.context.get(TRACK_OFFICE_ACTIVITY)) return next(request);

  const activity = inject(OfficeActivityService);

  return defer(() => {
    const finish = activity.begin();
    return next(request).pipe(finalize(finish));
  });
};
