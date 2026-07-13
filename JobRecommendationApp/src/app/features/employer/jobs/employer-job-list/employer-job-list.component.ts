import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// TODO: ผูกกับ GET /api/Job/my-jobs + ลิงก์ไป PUT/DELETE /api/Job/{id} และดูผู้สมัครที่ GET /api/JobApplication/job/{id}
@Component({
  selector: 'app-employer-job-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">ประกาศงานของฉัน</h1>
        <a routerLink="/employer/jobs/create" class="btn-primary">
          + สร้างประกาศงาน
        </a>
      </div>
      <p class="text-muted">TODO: ดึงรายการจาก GET /api/Job/my-jobs</p>
    </div>
  `
})
export class EmployerJobListComponent {}
