import { Component, inject, signal } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { EmployerProfile } from '../../../core/models/employer-profile.model';
import { ListPageBase } from '../../../shared/base/list-page-base';

@Component({
  selector: 'app-admin-employers',
  standalone: true,
  templateUrl: './admin-employers.component.html'
})
export class AdminEmployersComponent extends ListPageBase {
  private adminService = inject(AdminService);

  employers = signal<EmployerProfile[]>([]);

  constructor() {
    super();
    this.load();
  }

  private load() {
    this.adminService.getPendingEmployers().subscribe({
      next: (employers) => {
        this.employers.set(employers);
        this.isLoading.set(false);
      },
      error: (err) => this.setError(err, 'โหลดรายชื่อผู้ประกอบการไม่สำเร็จ กรุณาลองใหม่')
    });
  }

  verify(id: number) {
    this.adminService.verifyEmployer(id).subscribe({
      next: () => this.employers.update((list) => list.filter((e) => e.id !== id)),
      error: () => alert('ยืนยันตัวตนไม่สำเร็จ กรุณาลองใหม่')
    });
  }

  reject(id: number) {
    if (!confirm('ยืนยันการปฏิเสธการยืนยันตัวตนบริษัทนี้?')) return;

    this.adminService.rejectEmployer(id).subscribe({
      next: () => this.employers.update((list) => list.filter((e) => e.id !== id)),
      error: () => alert('ดำเนินการไม่สำเร็จ กรุณาลองใหม่')
    });
  }
}
