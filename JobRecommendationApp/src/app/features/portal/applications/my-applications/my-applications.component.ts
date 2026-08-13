import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JobApplicationService } from '../../../../core/services/job-application.service';
import { ApplicationStatus, MyApplication } from '../../../../core/models/job-application.model';
import { ListPageBase } from '../../../../shared/base/list-page-base';

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
  templateUrl: './my-applications.component.html'
})
export class MyApplicationsComponent extends ListPageBase {
  private jobApplicationService = inject(JobApplicationService);

  applications = signal<MyApplication[]>([]);

  constructor() {
    super();
    this.jobApplicationService.getMyApplications().subscribe({
      next: (apps) => {
        this.applications.set(apps);
        this.isLoading.set(false);
      },
      error: (err) => this.setError(err, 'โหลดรายการใบสมัครไม่สำเร็จ กรุณาลองใหม่')
    });
  }

  statusLabel(status: ApplicationStatus): string {
    return STATUS_LABEL[status] ?? status;
  }

  statusClass(status: ApplicationStatus): string {
    return STATUS_CLASS[status] ?? 'bg-gray-100 text-gray-700';
  }
}
