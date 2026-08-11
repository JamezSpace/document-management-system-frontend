import { HttpContextToken } from '@angular/common/http';
import { ErrorSurface } from '../../../enums/global/errorSurface.enum';

const ERROR_SURFACE = new HttpContextToken<ErrorSurface>(() => ErrorSurface.TOAST);

const SKIP_ERROR_PRESENTATION = new HttpContextToken<boolean>(() => false);

export {
     ERROR_SURFACE,
     SKIP_ERROR_PRESENTATION
}