import { HttpContext, HttpContextToken } from '@angular/common/http';

const TRACK_OFFICE_ACTIVITY = new HttpContextToken<boolean>(() => false);

function officeActivityContext(context = new HttpContext()): HttpContext {
  return context.set(TRACK_OFFICE_ACTIVITY, true);
}

export { TRACK_OFFICE_ACTIVITY, officeActivityContext };
