import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { JobService } from '../../../../core/services/job.service';
import { JobApplicationService } from '../../../../core/services/job-application.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { JobPost } from '../../../../core/models/job.model';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (isLoading()) {
      <p class="text-muted">กำลังโหลด...</p>
    } @else if (loadError()) {
      <p class="form-error">{{ loadError() }}</p>
    } @else {
      @if (job(); as job) {
        <div class="card max-w-2xl">
          <h1 class="page-title mb-2">{{ job.title }}</h1>
          <p class="text-muted mb-4">{{ job.companyName }} · {{ job.location || 'ไม่ระบุพื้นที่' }}</p>

          <dl class="space-y-3 mb-6">
            <div>
              <dt class="text-sm font-medium text-gray-700">เงินเดือนที่เสนอ</dt>
              <dd class="text-gray-900">{{ job.offeredSalary | number }} บาท</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-700">ทักษะที่ต้องการ</dt>
              <dd class="text-gray-900">{{ job.requiredSkills }}</dd>
            </div>
            @if (job.description) {
              <div>
                <dt class="text-sm font-medium text-gray-700">รายละเอียดงาน</dt>
                <dd class="text-gray-900 whitespace-pre-line">{{ job.description }}</dd>
              </div>
            }
          </dl>

          @if (authService.role() === 'JobSeeker') {
            <button (click)="apply()" [disabled]="isApplying() || applySuccess()" class="btn-primary">
              {{ applySuccess() ? 'สมัครแล้ว' : (isApplying() ? 'กำลังส่งใบสมัคร...' : 'สมัครงานนี้') }}
            </button>
            @if (applyMessage()) {
              <p class="mt-2 text-sm" [class.text-green-600]="applySuccess()" [class.text-red-600]="!applySuccess()">
                {{ applyMessage() }}
              </p>
            }
          } @else if (!authService.isAuthenticated()) {
            <a routerLink="/login" [queryParams]="{ returnUrl: '/jobs/' + jobId }" class="btn-primary">
              เข้าสู่ระบบเพื่อสมัครงาน
            </a>
          }
        </div>
      }
    }
  `
})
export class JobDetailComponent {
  private route = inject(ActivatedRoute);
  private jobService = inject(JobService);
  private jobApplicationService = inject(JobApplicationService);
  authService = inject(AuthService);

  jobId = Number(this.route.snapshot.paramMap.get('id'));

  job = signal<JobPost | null>(null);
  isLoading = signal(true);
  loadError = signal<string | null>(null);

  isApplying = signal(false);
  applySuccess = signal(false);
  applyMessage = signal<string | null>(null);

  constructor() {
    this.jobService.getJobById(this.jobId).subscribe({
      next: (job) => {
        this.job.set(job);
        this.isLoading.set(false);
      },
      error: () => {
        this.loadError.set('ไม่พบประกาศงานนี้ หรือประกาศถูกลบไปแล้ว');
        this.isLoading.set(false);
      }
    });
  }

  apply() {
    this.isApplying.set(true);
    this.applyMessage.set(null);

    this.jobApplicationService.apply(this.jobId).subscribe({
      next: () => {
        this.isApplying.set(false);
        this.applySuccess.set(true);
        this.applyMessage.set('ส่งใบสมัครสำเร็จ ผู้ประกอบการจะได้รับการแจ้งเตือน');
      },
      error: (err: HttpErrorResponse) => {
        this.isApplying.set(false);
        this.applyMessage.set(typeof err.error === 'string' ? err.error : 'สมัครงานไม่สำเร็จ กรุณาลองใหม่');
      }
    });
  }
}
