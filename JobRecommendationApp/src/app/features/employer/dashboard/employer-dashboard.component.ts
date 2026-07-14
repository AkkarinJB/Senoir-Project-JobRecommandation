import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JobService } from '../../../core/services/job.service';
import { EmployerProfileService } from '../../../core/services/employer-profile.service';

@Component({
  selector: 'app-employer-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div>
      <h1 class="page-title">Dashboard ผู้ประกอบการ</h1>

      <div class="grid grid-cols-2 gap-4 max-w-lg mb-6">
        <div class="card">
          <p class="text-sm text-muted">ประกาศงานทั้งหมด</p>
          <p class="text-3xl font-bold text-gray-900">{{ totalJobs() }}</p>
        </div>
        <div class="card">
          <p class="text-sm text-muted">เปิดรับสมัครอยู่</p>
          <p class="text-3xl font-bold text-gray-900">{{ activeJobs() }}</p>
        </div>
      </div>

      @if (!isVerified() && !isLoadingProfile()) {
        <p class="text-sm text-amber-700 bg-amber-50 rounded-lg px-4 py-3 mb-6">
          บัญชีบริษัทของคุณยังไม่ได้รับการยืนยันตัวตน —
          <a routerLink="/employer/company-profile" class="underline">ไปที่ข้อมูลบริษัท</a>
        </p>
      }

      <a routerLink="/employer/jobs" class="btn-primary">จัดการประกาศงาน</a>
    </div>
  `
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
