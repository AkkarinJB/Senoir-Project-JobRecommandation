import { Component } from '@angular/core';

// TODO: ผูกกับ GET /api/JobApplication/my-applications
@Component({
  selector: 'app-my-applications',
  standalone: true,
  template: `
    <div>
      <h1 class="page-title">ใบสมัครของฉัน</h1>
      <p class="text-muted">TODO: ดึงรายการจาก GET /api/JobApplication/my-applications</p>
    </div>
  `
})
export class MyApplicationsComponent {}
