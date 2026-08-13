import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { JobService } from '../../../../core/services/job.service';
import { JobApplicationService } from '../../../../core/services/job-application.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { JobPost } from '../../../../core/models/job.model';
import { extractErrorMessage } from '../../../../core/utils/http-error.util';

// หน้านี้มีสอง state แยกจากกัน: โหลดรายละเอียดงาน (job/isLoading/loadError) กับส่งใบสมัคร
// (isApplying/applySuccess/applyMessage) จึงไม่ extend base class ตัวใดตัวหนึ่งเพราะไม่มีชุดไหนตรงพอดีทั้งหน้า
@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './job-detail.component.html'
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
      error: (err) => {
        this.isApplying.set(false);
        this.applyMessage.set(extractErrorMessage(err, 'สมัครงานไม่สำเร็จ กรุณาลองใหม่'));
      }
    });
  }
}
