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

// รายการงานแบบรวม: ถ้าเป็น JobSeeker ที่มีโปรไฟล์แล้ว จะได้ matchPercentage มาด้วยจาก /Recommendation/match-jobs
// ไม่งั้นแสดงเป็นรายการทั่วไปจาก GET /api/Job — สองแหล่งข้อมูลนี้ shape ไม่เหมือนกัน (recommendation ไม่มี companyName) จึง map รวมเป็น interface เดียว
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
  template: `
    <div>
      <div class="flex items-center justify-between mb-6 gap-4">
        <h1 class="page-title mb-0">ค้นหางาน</h1>
        <input type="text" [(ngModel)]="searchTerm" placeholder="ค้นหาด้วยตำแหน่ง / บริษัท"
               class="form-input max-w-xs" />
      </div>

      @if (isLoading()) {
        <p class="text-muted">กำลังโหลดรายการงาน...</p>
      } @else if (errorMessage()) {
        <p class="form-error">{{ errorMessage() }}</p>
      } @else if (filteredJobs().length === 0) {
        <p class="text-muted">ยังไม่มีประกาศงานที่ตรงกับเงื่อนไข</p>
      } @else {
        @if (isRecommendationMode()) {
          <p class="text-sm text-muted mb-4">เรียงตามความเหมาะสมกับโปรไฟล์ของคุณ (Content-based Filtering + Jaccard Similarity)</p>
        }
        <div class="grid gap-4">
          @for (job of filteredJobs(); track job.jobId) {
            <a [routerLink]="['/jobs', job.jobId]" class="card block hover:shadow-md transition-shadow p-6">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">{{ job.title }}</h2>
                  <p class="text-sm text-muted">
                    {{ job.companyName ? job.companyName + ' · ' : '' }}{{ job.location || 'ไม่ระบุพื้นที่' }}
                  </p>
                </div>
                @if (job.matchPercentage !== null) {
                  <span class="shrink-0 bg-brand-50 text-brand-700 text-sm font-semibold px-3 py-1 rounded-full">
                    ตรงกัน {{ job.matchPercentage }}%
                  </span>
                }
              </div>
              <p class="text-sm text-gray-600 mt-2">เงินเดือน {{ job.offeredSalary | number }} บาท</p>
              @if (job.matchedSkills.length > 0) {
                <div class="flex flex-wrap gap-1 mt-3">
                  @for (skill of job.matchedSkills; track skill) {
                    <span class="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{{ skill }}</span>
                  }
                </div>
              }
            </a>
          }
        </div>
      }
    </div>
  `
})
export class JobListComponent {
  private jobService = inject(JobService);
  private recommendationService = inject(RecommendationService);
  private authService = inject(AuthService);

  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
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
    this.loadJobs();
  }

  private loadJobs() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    if (this.authService.role() === 'JobSeeker') {
      // ลองขอคำแนะนำก่อน ถ้ายังไม่มีโปรไฟล์ backend จะตอบ 400 — fallback ไปรายการทั่วไปแทนไม่ให้หน้าใช้งานไม่ได้
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
      error: () => {
        this.errorMessage.set('โหลดรายการงานไม่สำเร็จ กรุณาลองใหม่');
        this.isLoading.set(false);
      }
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
