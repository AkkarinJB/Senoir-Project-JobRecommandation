import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// TODO: ผูกฟอร์มกับ POST /api/Job (สร้างใหม่) หรือ PUT /api/Job/{id} (แก้ไข) แล้วแต่ว่ามี id ใน route หรือไม่
@Component({
  selector: 'app-employer-job-form',
  standalone: true,
  template: `
    <div>
      <h1 class="page-title">{{ jobId ? 'แก้ไขประกาศงาน' : 'สร้างประกาศงานใหม่' }}</h1>
      <p class="text-muted">TODO: ผูกฟอร์มกับ {{ jobId ? 'PUT /api/Job/' + jobId : 'POST /api/Job' }}</p>
    </div>
  `
})
export class EmployerJobFormComponent {
  private route = inject(ActivatedRoute);
  jobId = this.route.snapshot.paramMap.get('id');
}
