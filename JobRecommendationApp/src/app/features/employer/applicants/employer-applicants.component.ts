import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { JobApplicationService } from '../../../core/services/job-application.service';
import { APPLICATION_STATUSES, ApplicantResult, ApplicationStatus } from '../../../core/models/job-application.model';

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
  template: `
    <div>
      <h1 class="page-title">ผู้สมัครในตำแหน่งนี้</h1>

      @if (isLoading()) {
        <p class="text-muted">กำลังโหลด...</p>
      } @else if (applicants().length === 0) {
        <p class="text-muted">ยังไม่มีผู้สมัครในตำแหน่งนี้</p>
      } @else {
        <div class="grid gap-3">
          @for (applicant of applicants(); track applicant.applicationId) {
            <div class="card p-5 flex items-center justify-between gap-4">
              <div>
                <h2 class="font-semibold text-gray-900">{{ applicant.candidateName }}</h2>
                <p class="text-sm text-muted">ทักษะ: {{ applicant.candidateSkills }}</p>
                <p class="text-sm text-muted">ประสบการณ์ {{ applicant.candidateExperienceYears }} ปี</p>
                <p class="text-xs text-muted mt-1">สมัครเมื่อ {{ applicant.appliedAt | date: 'd MMM y, HH:mm' }}</p>
              </div>
              <select [ngModel]="applicant.status" (ngModelChange)="updateStatus(applicant, $event)"
                      class="form-input w-auto">
                @for (status of statuses; track status) {
                  <option [value]="status">{{ statusLabel(status) }}</option>
                }
              </select>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class EmployerApplicantsComponent {
  private route = inject(ActivatedRoute);
  private jobApplicationService = inject(JobApplicationService);

  jobId = Number(this.route.snapshot.paramMap.get('jobId'));
  statuses = APPLICATION_STATUSES;

  isLoading = signal(true);
  applicants = signal<ApplicantResult[]>([]);

  constructor() {
    this.jobApplicationService.getApplicantsForJob(this.jobId).subscribe({
      next: (applicants) => {
        this.applicants.set(applicants);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
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
