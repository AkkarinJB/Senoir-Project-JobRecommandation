import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JobApplicationService } from '../../../../core/services/job-application.service';
import { ApplicationStatus, MyApplication } from '../../../../core/models/job-application.model';

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  Applied: 'รอพิจารณา',
  Reviewed: 'กำลังพิจารณา',
  Accepted: 'ผ่านการคัดเลือก',
  Rejected: 'ไม่ผ่านการคัดเลือก'
};

const STATUS_CLASS: Record<ApplicationStatus, string> = {
  Applied: 'bg-gray-100 text-gray-700',
  Reviewed: 'bg-amber-50 text-amber-700',
  Accepted: 'bg-green-50 text-green-700',
  Rejected: 'bg-red-50 text-red-700'
};

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div>
      <h1 class="page-title">ใบสมัครของฉัน</h1>

      @if (isLoading()) {
        <p class="text-muted">กำลังโหลด...</p>
      } @else if (errorMessage()) {
        <p class="form-error">{{ errorMessage() }}</p>
      } @else if (applications().length === 0) {
        <p class="text-muted">คุณยังไม่ได้สมัครงานใดเลย <a routerLink="/jobs" class="text-brand-600 hover:underline">เริ่มค้นหางาน</a></p>
      } @else {
        <div class="grid gap-3">
          @for (app of applications(); track app.id) {
            <a [routerLink]="['/jobs', app.jobId]" class="card flex items-center justify-between p-5 hover:shadow-md transition-shadow">
              <div>
                <h2 class="font-semibold text-gray-900">{{ app.title }}</h2>
                <p class="text-sm text-muted">{{ app.companyName }} · {{ app.location || 'ไม่ระบุพื้นที่' }}</p>
                <p class="text-xs text-muted mt-1">สมัครเมื่อ {{ app.appliedAt | date: 'd MMM y, HH:mm' }}</p>
              </div>
              <span class="text-sm font-medium px-3 py-1 rounded-full" [class]="statusClass(app.status)">
                {{ statusLabel(app.status) }}
              </span>
            </a>
          }
        </div>
      }
    </div>
  `
})
export class MyApplicationsComponent {
  private jobApplicationService = inject(JobApplicationService);

  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  applications = signal<MyApplication[]>([]);

  constructor() {
    this.jobApplicationService.getMyApplications().subscribe({
      next: (apps) => {
        this.applications.set(apps);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('โหลดรายการใบสมัครไม่สำเร็จ กรุณาลองใหม่');
        this.isLoading.set(false);
      }
    });
  }

  statusLabel(status: ApplicationStatus): string {
    return STATUS_LABEL[status] ?? status;
  }

  statusClass(status: ApplicationStatus): string {
    return STATUS_CLASS[status] ?? 'bg-gray-100 text-gray-700';
  }
}
