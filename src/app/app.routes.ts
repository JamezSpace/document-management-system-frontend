import { Routes } from '@angular/router';
import { Auth } from './pages/auth/auth';
import { Onboarding } from './pages/onboarding/onboarding';

export const routes: Routes = [
    {
        path: '',
        component: Auth
    },
    {
        path:':entityType/onboarding/:entityId',
        component: Onboarding,
    }
];
