import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { JobPost } from '../../../core/models/job.model';
import { ListPageBase } from '../../../shared/base/list-page-base';

@Component({
  selector: 'app-admin-manage-jobs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-manage-jobs.component.html'
})
export class AdminManageJobsComponent extends ListPageBase {
  private adminService = inject(AdminService);

  jobs = signal<JobPost[]>([]);

  constructor() {
    super();
    this.adminService.getAllJobsForModeration().subscribe({
      next: (jobs) => {
        this.jobs.set(jobs);
        this.isLoading.set(false);
      },
      error: (err) => this.setError(err, 'โหลดรายการประกาศงานไม่สำเร็จ กรุณาลองใหม่')
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
