import { Routes } from '@angular/router';
import { EmployerLayoutComponent } from './layout/employer-layout/employer-layout.component';

export const EMPLOYER_ROUTES: Routes = [
  {
    path: '',
    component: EmployerLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/employer-dashboard.component').then(c => c.EmployerDashboardComponent)
      },
      {
        path: 'company-profile',
        loadComponent: () => import('./company-profile/employer-company-profile.component').then(c => c.EmployerCompanyProfileComponent)
      },
      {
        path: 'jobs',
        loadComponent: () => import('./jobs/employer-job-list/employer-job-list.component').then(c => c.EmployerJobListComponent)
      },
      {
        path: 'jobs/create',
        loadComponent: () => import('./jobs/employer-job-form/employer-job-form.component').then(c => c.EmployerJobFormComponent)
      },
      {
        path: 'jobs/:id/edit',
        loadComponent: () => import('./jobs/employer-job-form/employer-job-form.component').then(c => c.EmployerJobFormComponent)
      },
      {
        path: 'jobs/:jobId/applicants',
        loadComponent: () => import('./applicants/employer-applicants.component').then(c => c.EmployerApplicantsComponent)
      }
    ]
  }
];
