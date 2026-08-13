import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { JobService } from '../../../../core/services/job.service';
import { RecommendationService } from '../../../../core/services/recommendation.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { JobPost } from '../../../../core/models/job.model';
import { JobRecommendation } from '../../../../core/models/recommendation.model';
import { ListPageBase } from '../../../../shared/base/list-page-base';

interface JobListItem {
  jobId: number;
  title: string;
  companyName: string;
  location: string;
  offeredSalary: number;
  matchPercentage: number | null;
  matchedSkills: string[];
}

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './job-list.component.html'
})
export class JobListComponent extends ListPageBase {
  private jobService = inject(JobService);
  private recommendationService = inject(RecommendationService);
  private authService = inject(AuthService);

  isRecommendationMode = signal(false);
  searchTerm = '';

  private jobs = signal<JobListItem[]>([]);

  filteredJobs = computed(() => {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.jobs();
    return this.jobs().filter(
      (j) => j.title.toLowerCase().includes(term) || j.companyName.toLowerCase().includes(term)
    );
  });

  constructor() {
    super();
    this.loadJobs();
  }

  private loadJobs() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    if (this.authService.role() === 'JobSeeker') {
      this.recommendationService
        .getRecommendedJobs()
        .pipe(catchError(() => of(null)))
        .subscribe((recommendations) => {
          if (recommendations) {
            this.isRecommendationMode.set(true);
            this.jobs.set(recommendations.map((r) => this.mapRecommendation(r)));
            this.isLoading.set(false);
          } else {
            this.loadPlainJobList();
          }
        });
    } else {
      this.loadPlainJobList();
    }
  }

  private loadPlainJobList() {
    this.jobService.getAllJobs().subscribe({
      next: (jobs) => {
        this.isRecommendationMode.set(false);
        this.jobs.set(jobs.map((j) => this.mapJobPost(j)));
        this.isLoading.set(false);
      },
      error: (err) => this.setError(err, 'โหลดรายการงานไม่สำเร็จ กรุณาลองใหม่')
    });
  }

  private mapJobPost(job: JobPost): JobListItem {
    return {
      jobId: job.id,
      title: job.title,
      companyName: job.companyName,
      location: job.location,
      offeredSalary: job.offeredSalary,
      matchPercentage: null,
      matchedSkills: []
    };
  }

  private mapRecommendation(r: JobRecommendation): JobListItem {
    return {
      jobId: r.jobId,
      title: r.title,
      companyName: '',
      location: r.location,
      offeredSalary: r.offeredSalary,
      matchPercentage: r.matchPercentage,
      matchedSkills: r.matchedSkills
    };
  }
}
