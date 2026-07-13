import { Component } from '@angular/core';

// TODO: ผูกกับ GET /api/Admin/employers/pending + ปุ่ม verify/reject เรียก POST /api/Admin/employers/{id}/verify|reject
@Component({
  selector: 'app-admin-employers',
  standalone: true,
  template: `
    <div>
      <h1 class="page-title">ยืนยันตัวตนผู้ประกอบการ</h1>
      <p class="text-muted">TODO: ดึงรายการรออนุมัติจาก GET /api/Admin/employers/pending</p>
    </div>
  `
})
export class AdminEmployersComponent {}
