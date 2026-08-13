import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JobService } from '../../../core/services/job.service';
import { EmployerProfileService } from '../../../core/services/employer-profile.service';

@Component({
  selector: 'app-employer-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './employer-dashboard.component.html'
})
export class EmployerDashboardComponent {
  private jobService = inject(JobService);
  private employerProfileService = inject(EmployerProfileService);

  totalJobs = signal(0);
  activeJobs = signal(0);
  isVerified = signal(false);
  isLoadingProfile = signal(true);

  constructor() {
    this.jobService.getMyJobs().subscribe({
      next: (jobs) => {
        this.totalJobs.set(jobs.length);
        this.activeJobs.set(jobs.filter((j) => j.isActive).length);
      },
      error: () => {}
    });

    this.employerProfileService.getMyProfile().subscribe({
      next: (profile) => {
        this.isVerified.set(profile.isVerified);
        this.isLoadingProfile.set(false);
      },
      error: () => this.isLoadingProfile.set(false)
    });
  }
}
