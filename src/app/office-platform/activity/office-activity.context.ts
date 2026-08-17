import { HttpContext, HttpContextToken } from '@angular/common/http';

export const TRACK_OFFICE_ACTIVITY = new HttpContextToken<boolean>(() => false);

export function officeActivityContext(context = new HttpContext()): HttpContext {
  return context.set(TRACK_OFFICE_ACTIVITY, true);
}
