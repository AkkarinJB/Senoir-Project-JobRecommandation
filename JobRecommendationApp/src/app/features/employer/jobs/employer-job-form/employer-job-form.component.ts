import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { JobService } from '../../../../core/services/job.service';
import { CategoryService } from '../../../../core/services/category.service';
import { JobPostPayload } from '../../../../core/models/job.model';
import { JobCategory } from '../../../../core/models/category.model';

@Component({
  selector: 'app-employer-job-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card max-w-2xl">
      <h1 class="page-title">{{ jobId ? 'แก้ไขประกาศงาน' : 'สร้างประกาศงานใหม่' }}</h1>

      @if (isLoading()) {
        <p class="text-muted">กำลังโหลด...</p>
      } @else {
        <form (ngSubmit)="submit()" class="space-y-4">
          <div>
            <label class="form-label">ตำแหน่งงาน</label>
            <input type="text" name="title" [(ngModel)]="form.title" required class="form-input" />
          </div>

          <div>
            <label class="form-label">ชื่อบริษัท</label>
            <input type="text" name="companyName" [(ngModel)]="form.companyName" required class="form-input" />
          </div>

          <div>
            <label class="form-label">ทักษะที่ต้องการ (คั่นด้วยจุลภาคหรือเว้นวรรค)</label>
            <input type="text" name="requiredSkills" [(ngModel)]="form.requiredSkills" required
                   placeholder="เช่น C#, Angular, SQL" class="form-input" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="form-label">เงินเดือนที่เสนอ (บาท)</label>
              <input type="number" name="offeredSalary" [(ngModel)]="form.offeredSalary" min="0" required class="form-input" />
            </div>
            <div>
              <label class="form-label">พื้นที่ปฏิบัติงาน</label>
              <input type="text" name="location" [(ngModel)]="form.location" placeholder="เช่น อุดรธานี" class="form-input" />
            </div>
          </div>

          <div>
            <label class="form-label">หมวดหมู่งาน</label>
            <select name="categoryId" [(ngModel)]="form.categoryId" class="form-input">
              <option [ngValue]="null">-- ไม่ระบุหมวดหมู่ --</option>
              @for (category of categories(); track category.id) {
                <option [ngValue]="category.id">{{ category.name }}</option>
              }
            </select>
          </div>

          <div>
            <label class="form-label">รายละเอียดงาน</label>
            <textarea name="description" [(ngModel)]="form.description" rows="4" class="form-input"></textarea>
          </div>

          @if (errorMessage()) {
            <p class="form-error">{{ errorMessage() }}</p>
          }

          <button type="submit" [disabled]="isSubmitting()" class="btn-primary">
            {{ isSubmitting() ? 'กำลังบันทึก...' : (jobId ? 'บันทึกการแก้ไข' : 'สร้างประกาศงาน') }}
          </button>
        </form>
      }
    </div>
  `
})
export class EmployerJobFormComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private jobService = inject(JobService);
  private categoryService = inject(CategoryService);

  jobId = this.route.snapshot.paramMap.get('id') ? Number(this.route.snapshot.paramMap.get('id')) : null;

  isLoading = signal(true);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  categories = signal<JobCategory[]>([]);

  form: JobPostPayload = {
    title: '',
    description: '',
    companyName: '',
    requiredSkills: '',
    offeredSalary: 0,
    location: '',
    categoryId: null
  };

  constructor() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: () => {}
    });

    if (this.jobId) {
      this.jobService.getJobById(this.jobId).subscribe({
        next: (job) => {
          this.form = {
            title: job.title,
            description: job.description,
            companyName: job.companyName,
            requiredSkills: job.requiredSkills,
            offeredSalary: job.offeredSalary,
            location: job.location,
            categoryId: job.categoryId
          };
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('โหลดข้อมูลประกาศงานไม่สำเร็จ');
          this.isLoading.set(false);
        }
      });
    } else {
      this.isLoading.set(false);
    }
  }

  submit() {
    if (!this.form.title || !this.form.companyName || !this.form.requiredSkills) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const request = this.jobId
      ? this.jobService.updateJob(this.jobId, this.form)
      : this.jobService.createJob(this.form);

    request.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/employer/jobs']);
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(typeof err.error === 'string' ? err.error : 'บันทึกไม่สำเร็จ กรุณาลองใหม่');
      }
    });
  }
}
