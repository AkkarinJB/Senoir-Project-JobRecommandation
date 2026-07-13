import { Component } from '@angular/core';

// TODO: ดึงรายการงานจริงจาก GET /api/Job (public) — ตอนนี้เป็น placeholder สำหรับวาง routing ก่อน
@Component({
  selector: 'app-job-list',
  standalone: true,
  template: `
    <div>
      <h1 class="page-title">ค้นหางาน</h1>
      <p class="text-muted">TODO: ดึงรายการประกาศงานจาก GET /api/Job</p>
    </div>
  `
})
export class JobListComponent {}
