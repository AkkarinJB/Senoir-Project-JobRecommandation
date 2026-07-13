import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// TODO: ผูกกับ GET /api/JobApplication/job/{jobId} + ปุ่มเปลี่ยนสถานะเรียก PUT /api/JobApplication/{applicationId}/status
@Component({
  selector: 'app-employer-applicants',
  standalone: true,
  template: `
    <div>
      <h1 class="page-title">ผู้สมัครในตำแหน่งนี้</h1>
      <p class="text-muted">TODO: ดึงรายชื่อจาก GET /api/JobApplication/job/{{ jobId }}</p>
    </div>
  `
})
export class EmployerApplicantsComponent {
  private route = inject(ActivatedRoute);
  jobId = this.route.snapshot.paramMap.get('jobId');
}
