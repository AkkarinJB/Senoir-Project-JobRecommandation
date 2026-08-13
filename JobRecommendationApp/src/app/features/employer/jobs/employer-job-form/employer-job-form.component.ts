import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from '../../../../core/services/job.service';
import { CategoryService } from '../../../../core/services/category.service';
import { JobPostPayload } from '../../../../core/models/job.model';
import { JobCategory } from '../../../../core/models/category.model';
import { Skill } from '../../../../core/models/skill.model';
import { SkillChipSelectComponent } from '../../../../shared/skill-chip-select/skill-chip-select.component';
import { FormPageBase } from '../../../../shared/base/form-page-base';

@Component({
  selector: 'app-employer-job-form',
  standalone: true,
  imports: [CommonModule, FormsModule, SkillChipSelectComponent],
  templateUrl: './employer-job-form.component.html'
})
export class EmployerJobFormComponent extends FormPageBase {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private jobService = inject(JobService);
  private categoryService = inject(CategoryService);

  jobId = this.route.snapshot.paramMap.get('id') ? Number(this.route.snapshot.paramMap.get('id')) : null;

  categories = signal<JobCategory[]>([]);
  selectedSkills: Skill[] = [];
  newCategoryName = '';

  form: JobPostPayload = {
    title: '',
    description: '',
    companyName: '',
    skillIds: [],
    offeredSalary: 0,
    location: '',
    categoryId: null
  };

  constructor() {
    super();
    this.isLoading.set(true);

    this.categoryService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: () => {}
    });

    if (this.jobId) {
      this.jobService.getJobById(this.jobId).subscribe({
        next: (job) => {
          this.selectedSkills = job.requiredSkills;
          this.form = {
            title: job.title,
            description: job.description,
            companyName: job.companyName,
            skillIds: job.requiredSkills.map((s) => s.id),
            offeredSalary: job.offeredSalary,
            location: job.location,
            categoryId: job.categoryId
          };
          this.isLoading.set(false);
        },
        error: (err) => {
          this.setError(err, 'โหลดข้อมูลประกาศงานไม่สำเร็จ');
          this.isLoading.set(false);
        }
      });
    } else {
      this.isLoading.set(false);
    }
  }

  onSkillsChange(skills: Skill[]) {
    this.selectedSkills = skills;
    this.form.skillIds = skills.map((s) => s.id);
  }

  addCategory() {
    const name = this.newCategoryName.trim();
    if (!name) return;

    this.categoryService.addCategory(name).subscribe({
      next: (category) => {
        if (!this.categories().some((c) => c.id === category.id)) {
          this.categories.set([...this.categories(), category]);
        }
        this.form.categoryId = category.id;
        this.newCategoryName = '';
      },
      error: (err) => this.setError(err, 'เพิ่มหมวดหมู่ไม่สำเร็จ กรุณาลองใหม่')
    });
  }

  submit() {
    this.clearMessages();

    if (!this.form.title || !this.form.companyName) {
      this.errorMessage.set('กรุณากรอกตำแหน่งงานและชื่อบริษัท');
      return;
    }
    if (this.form.skillIds.length === 0) {
      this.errorMessage.set('กรุณาเพิ่มทักษะที่ต้องการอย่างน้อย 1 รายการ (พิมพ์แล้วกด Enter หรือเลือกจากรายการ)');
      return;
    }

    this.isSubmitting.set(true);

    const request = this.jobId
      ? this.jobService.updateJob(this.jobId, this.form)
      : this.jobService.createJob(this.form);

    request.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/employer/jobs']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.setError(err, 'บันทึกไม่สำเร็จ กรุณาลองใหม่');
      }
    });
  }
}
