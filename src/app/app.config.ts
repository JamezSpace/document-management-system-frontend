import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
    provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { getAnalytics } from 'firebase/analytics';
import { FirebaseOptions, initializeApp } from 'firebase/app';
import { environment } from '../environments/environment.development';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth/auth-interceptor';

// init firebase
const firebaseConfig: FirebaseOptions = {
  apiKey: environment.auth.firebase.api_key,
  appId: environment.auth.firebase.app_id,
  authDomain: environment.auth.firebase.auth_domain,
  messagingSenderId: environment.auth.firebase.messaging_sender_id,
  projectId: environment.auth.firebase.project_id,
  storageBucket: environment.auth.firebase.storage_bucket,
  measurementId: environment.auth.firebase.measurement_id
};

export const firebase_app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(firebase_app);
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor]))
  ],
};
