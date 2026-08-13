import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JobService } from '../../../../core/services/job.service';
import { JobPost } from '../../../../core/models/job.model';
import { ListPageBase } from '../../../../shared/base/list-page-base';

@Component({
  selector: 'app-employer-job-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employer-job-list.component.html'
})
export class EmployerJobListComponent extends ListPageBase {
  private jobService = inject(JobService);

  jobs = signal<JobPost[]>([]);

  constructor() {
    super();
    this.load();
  }

  private load() {
    this.jobService.getMyJobs().subscribe({
      next: (jobs) => {
        this.jobs.set(jobs);
        this.isLoading.set(false);
      },
      error: (err) => this.setError(err, 'โหลดประกาศงานไม่สำเร็จ กรุณาลองใหม่')
    });
  }

  deleteJob(id: number) {
    if (!confirm('ยืนยันการลบประกาศงานนี้? ใบสมัครที่ผูกกับประกาศนี้จะถูกลบไปด้วย')) return;

    this.jobService.deleteJob(id).subscribe({
      next: () => this.jobs.update((list) => list.filter((j) => j.id !== id)),
      error: () => alert('ลบประกาศงานไม่สำเร็จ กรุณาลองใหม่')
    });
  }
}
