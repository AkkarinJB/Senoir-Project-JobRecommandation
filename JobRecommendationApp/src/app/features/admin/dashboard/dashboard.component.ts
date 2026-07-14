import { Component, inject, signal } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private adminService = inject(AdminService);

  totalUsers = signal(0);
  totalJobs = signal(0);
  pendingEmployers = signal(0);

  constructor() {
    this.adminService.getUsers().subscribe({
      next: (users) => this.totalUsers.set(users.length),
      error: () => {}
    });
    this.adminService.getAllJobsForModeration().subscribe({
      next: (jobs) => this.totalJobs.set(jobs.length),
      error: () => {}
    });
    this.adminService.getPendingEmployers().subscribe({
      next: (employers) => this.pendingEmployers.set(employers.length),
      error: () => {}
    });
  }
}
