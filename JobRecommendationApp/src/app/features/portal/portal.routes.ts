import { Routes } from '@angular/router';
import { PortalLayoutComponent } from './layout/portal-layout/portal-layout.component';
import { roleGuard } from '../../core/auth/role.guard';
import { guestGuard } from '../../core/auth/guest.guard';

export const PORTAL_ROUTES: Routes = [
  {
    path: '',
    component: PortalLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./home/home.component').then(c => c.HomeComponent)
      },
      {
        path: 'jobs',
        loadComponent: () => import('./jobs/job-list/job-list.component').then(c => c.JobListComponent)
      },
      {
        path: 'jobs/:id',
        loadComponent: () => import('./jobs/job-detail/job-detail.component').then(c => c.JobDetailComponent)
      },
      {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () => import('./auth/login/login.component').then(c => c.LoginComponent)
      },
      {
        path: 'register',
        canActivate: [guestGuard],
        loadComponent: () => import('./auth/register/register.component').then(c => c.RegisterComponent)
      },
      {
        path: 'my-profile',
        canActivate: [roleGuard(['JobSeeker'])],
        loadComponent: () => import('./profile/my-profile/my-profile.component').then(c => c.MyProfileComponent)
      },
      {
        path: 'my-applications',
        canActivate: [roleGuard(['JobSeeker'])],
        loadComponent: () => import('./applications/my-applications/my-applications.component').then(c => c.MyApplicationsComponent)
      }
    ]
  }
];
