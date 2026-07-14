import { Component, inject, signal } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { EmployerProfile } from '../../../core/models/employer-profile.model';

@Component({
  selector: 'app-admin-employers',
  standalone: true,
  template: `
    <div>
      <h1 class="page-title">ยืนยันตัวตนผู้ประกอบการ</h1>

      @if (isLoading()) {
        <p class="text-muted">กำลังโหลด...</p>
      } @else if (employers().length === 0) {
        <p class="text-muted">ไม่มีบริษัทที่รอการยืนยันตัวตนในขณะนี้</p>
      } @else {
        <div class="grid gap-3">
          @for (employer of employers(); track employer.id) {
            <div class="card p-5 flex items-start justify-between gap-4">
              <div>
                <h2 class="font-semibold text-gray-900">{{ employer.companyName }}</h2>
                @if (employer.companyDescription) {
                  <p class="text-sm text-muted mt-1">{{ employer.companyDescription }}</p>
                }
                @if (employer.address) {
                  <p class="text-sm text-muted">ที่อยู่: {{ employer.address }}</p>
                }
                @if (employer.website) {
                  <p class="text-sm text-muted">เว็บไซต์: {{ employer.website }}</p>
                }
              </div>
              <div class="flex gap-2 shrink-0">
                <button (click)="verify(employer.id)" class="btn-primary">ยืนยันตัวตน</button>
                <button (click)="reject(employer.id)" class="btn-outline">ปฏิเสธ</button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class AdminEmployersComponent {
  private adminService = inject(AdminService);

  isLoading = signal(true);
  employers = signal<EmployerProfile[]>([]);

  constructor() {
    this.load();
  }

  private load() {
    this.adminService.getPendingEmployers().subscribe({
      next: (employers) => {
        this.employers.set(employers);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
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
