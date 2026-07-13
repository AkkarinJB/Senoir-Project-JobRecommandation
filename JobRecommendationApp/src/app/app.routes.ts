import { Routes } from '@angular/router';
import { roleGuard } from './core/auth/role.guard';

export const routes: Routes = [
    {
        path: 'admin',
        canActivate: [roleGuard(['Admin'])],
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
    },
    {
        path: 'employer',
        canActivate: [roleGuard(['Employer'])],
        loadChildren: () => import('./features/employer/employer.routes').then(m => m.EMPLOYER_ROUTES)
    },
    {
        path: '',
        loadChildren: () => import('./features/portal/portal.routes').then(m => m.PORTAL_ROUTES)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
