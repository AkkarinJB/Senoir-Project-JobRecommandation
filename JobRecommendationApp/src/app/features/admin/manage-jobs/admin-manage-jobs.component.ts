import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { JobPost } from '../../../core/models/job.model';

@Component({
  selector: 'app-admin-manage-jobs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h1 class="page-title">จัดการโพสต์งาน</h1>

      @if (isLoading()) {
        <p class="text-muted">กำลังโหลด...</p>
      } @else if (jobs().length === 0) {
        <p class="text-muted">ยังไม่มีประกาศงานในระบบ</p>
      } @else {
        <div class="grid gap-3">
          @for (job of jobs(); track job.id) {
            <div class="card p-5 flex items-center justify-between gap-4">
              <div>
                <h2 class="font-semibold text-gray-900">{{ job.title }}</h2>
                <p class="text-sm text-muted">{{ job.companyName }} · {{ job.location || 'ไม่ระบุพื้นที่' }} · {{ job.offeredSalary | number }} บาท</p>
                <span class="inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-2"
                      [class.bg-green-50]="job.isActive" [class.text-green-700]="job.isActive"
                      [class.bg-gray-100]="!job.isActive" [class.text-gray-600]="!job.isActive">
                  {{ job.isActive ? 'เปิดรับสมัคร' : 'ปิดรับสมัครแล้ว' }}
                </span>
              </div>
              <button (click)="deleteJob(job.id)" class="btn-ghost-danger shrink-0">ลบประกาศ</button>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class AdminManageJobsComponent {
  private adminService = inject(AdminService);

  isLoading = signal(true);
  jobs = signal<JobPost[]>([]);

  constructor() {
    this.adminService.getAllJobsForModeration().subscribe({
      next: (jobs) => {
        this.jobs.set(jobs);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  deleteJob(id: number) {
    if (!confirm('ยืนยันการลบประกาศงานนี้โดยผู้ดูแลระบบ?')) return;

    this.adminService.deleteJob(id).subscribe({
      next: () => this.jobs.update((list) => list.filter((j) => j.id !== id)),
      error: () => alert('ลบประกาศงานไม่สำเร็จ กรุณาลองใหม่')
    });
  }
}
