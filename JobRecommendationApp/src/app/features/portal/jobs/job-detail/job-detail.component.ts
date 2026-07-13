import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// TODO: ดึงรายละเอียดงานจริงจาก GET /api/Job/{id} และปุ่ม "สมัครงาน" เรียก POST /api/JobApplication/{id}/apply
@Component({
  selector: 'app-job-detail',
  standalone: true,
  template: `
    <div>
      <h1 class="page-title">รายละเอียดงาน</h1>
      <p class="text-muted">TODO: ดึงข้อมูลงาน id = {{ jobId }} จาก GET /api/Job/{{ jobId }}</p>
    </div>
  `
})
export class JobDetailComponent {
  private route = inject(ActivatedRoute);
  jobId = this.route.snapshot.paramMap.get('id');
}
