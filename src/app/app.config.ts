import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { environment } from '../environments/environment.development';
import {FirebaseOptions, initializeApp} from 'firebase/app';
import {getAnalytics} from 'firebase/analytics';

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
    provideHttpClient(withFetch())
  ],
};
