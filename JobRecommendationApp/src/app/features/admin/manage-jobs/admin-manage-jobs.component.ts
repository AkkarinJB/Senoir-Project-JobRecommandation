import { Component } from '@angular/core';

// TODO: ผูกกับ GET /api/Job (moderation) + ปุ่มลบเรียก DELETE /api/Admin/jobs/{id}
@Component({
  selector: 'app-admin-manage-jobs',
  standalone: true,
  template: `
    <div>
      <h1 class="page-title">จัดการโพสต์งาน</h1>
      <p class="text-muted">TODO: ดึงรายการงานทั้งหมด + ปุ่มลบเรียก DELETE /api/Admin/jobs/{{ '{id}' }}</p>
    </div>
  `
})
export class AdminManageJobsComponent {}
