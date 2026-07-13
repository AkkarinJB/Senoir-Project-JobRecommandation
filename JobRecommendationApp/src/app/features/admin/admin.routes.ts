import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent)
      },
      {
        path: 'manage-jobs',
        loadComponent: () => import('./manage-jobs/admin-manage-jobs.component').then(c => c.AdminManageJobsComponent)
      },
      {
        path: 'employers',
        loadComponent: () => import('./employers/admin-employers.component').then(c => c.AdminEmployersComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('./categories/admin-categories.component').then(c => c.AdminCategoriesComponent)
      }
    ]
  }
];
