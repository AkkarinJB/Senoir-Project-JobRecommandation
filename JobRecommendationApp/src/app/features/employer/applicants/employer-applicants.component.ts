import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { JobApplicationService } from '../../../core/services/job-application.service';
import { APPLICATION_STATUSES, ApplicantResult, ApplicationStatus } from '../../../core/models/job-application.model';
import { ListPageBase } from '../../../shared/base/list-page-base';

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  Applied: 'รอพิจารณา',
  Reviewed: 'กำลังพิจารณา',
  Accepted: 'ผ่านการคัดเลือก',
  Rejected: 'ไม่ผ่านการคัดเลือก'
};

@Component({
  selector: 'app-employer-applicants',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employer-applicants.component.html'
})
export class EmployerApplicantsComponent extends ListPageBase {
  private route = inject(ActivatedRoute);
  private jobApplicationService = inject(JobApplicationService);

  jobId = Number(this.route.snapshot.paramMap.get('jobId'));
  statuses = APPLICATION_STATUSES;

  applicants = signal<ApplicantResult[]>([]);

  constructor() {
    super();
    this.jobApplicationService.getApplicantsForJob(this.jobId).subscribe({
      next: (applicants) => {
        this.applicants.set(applicants);
        this.isLoading.set(false);
      },
      error: (err) => this.setError(err, 'โหลดรายชื่อผู้สมัครไม่สำเร็จ กรุณาลองใหม่')
    });
  }

  statusLabel(status: ApplicationStatus): string {
    return STATUS_LABEL[status] ?? status;
  }

  updateStatus(applicant: ApplicantResult, newStatus: ApplicationStatus) {
    const previousStatus = applicant.status;
    applicant.status = newStatus;

    this.jobApplicationService.updateStatus(applicant.applicationId, newStatus).subscribe({
      error: () => {
        applicant.status = previousStatus;
        alert('เปลี่ยนสถานะไม่สำเร็จ กรุณาลองใหม่');
      }
    });
  }
}
