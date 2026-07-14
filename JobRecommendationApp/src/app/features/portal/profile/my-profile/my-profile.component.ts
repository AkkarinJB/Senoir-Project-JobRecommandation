import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CandidateProfileService } from '../../../../core/services/candidate-profile.service';
import { CandidateProfilePayload } from '../../../../core/models/candidate-profile.model';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="card max-w-xl-5">
      <h1 class="page-title">โปรไฟล์ของฉัน</h1>

      @if (isLoading()) {
        <p class="text-muted">กำลังโหลด...</p>
      } @else {
        @if (!hasProfile()) {
          <p class="text-sm text-muted mb-4">คุณยังไม่ได้สร้างโปรไฟล์ — กรอกข้อมูลด้านล่างเพื่อเริ่มใช้งานระบบแนะนำงาน</p>
        }

        <form (ngSubmit)="submit()" class="space-y-4">
          <div>
            <label class="form-label">ชื่อ-นามสกุล</label>
            <input type="text" name="fullName" [(ngModel)]="form.fullName" required class="form-input" />
          </div>

          <div>
            <label class="form-label">ทักษะ (คั่นด้วยจุลภาคหรือเว้นวรรค)</label>
            <input type="text" name="skills" [(ngModel)]="form.skills" required placeholder="เช่น C#, Angular, SQL"
                   class="form-input" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="form-label">เงินเดือนที่คาดหวัง (บาท)</label>
              <input type="number" name="expectedSalary" [(ngModel)]="form.expectedSalary" min="0" class="form-input" />
            </div>
            <div>
              <label class="form-label">ประสบการณ์ (ปี)</label>
              <input type="number" name="experienceYears" [(ngModel)]="form.experienceYears" min="0" class="form-input" />
            </div>
          </div>

          <div>
            <label class="form-label">พื้นที่ที่ต้องการทำงาน</label>
            <input type="text" name="preferredLocation" [(ngModel)]="form.preferredLocation" placeholder="เช่น อุดรธานี"
                   class="form-input" />
          </div>

          @if (errorMessage()) {
            <p class="form-error">{{ errorMessage() }}</p>
          }
          @if (successMessage()) {
            <p class="form-success">{{ successMessage() }}</p>
          }

          <div class="flex items-center gap-3">
            <button type="submit" [disabled]="isSubmitting()" class="btn-primary">
              {{ isSubmitting() ? 'กำลังบันทึก...' : (hasProfile() ? 'บันทึกการแก้ไข' : 'สร้างโปรไฟล์') }}
            </button>
            @if (hasProfile()) {
              <button type="button" (click)="deleteProfile()" [disabled]="isSubmitting()" class="btn-ghost-danger">
                ลบโปรไฟล์
              </button>
            }
          </div>
        </form>
      }
    </div>
  `
})
export class MyProfileComponent {
  private candidateProfileService = inject(CandidateProfileService);

  isLoading = signal(true);
  isSubmitting = signal(false);
  hasProfile = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  form: CandidateProfilePayload = {
    fullName: '',
    skills: '',
    expectedSalary: 0,
    experienceYears: 0,
    preferredLocation: ''
  };

  constructor() {
    this.candidateProfileService.getMyProfile().subscribe({
      next: (profile) => {
        this.hasProfile.set(true);
        this.form = {
          fullName: profile.fullName,
          skills: profile.skills,
          expectedSalary: profile.expectedSalary,
          experienceYears: profile.experienceYears,
          preferredLocation: profile.preferredLocation ?? ''
        };
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  submit() {
    if (!this.form.fullName || !this.form.skills) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const request = this.hasProfile()
      ? this.candidateProfileService.updateProfile(this.form)
      : this.candidateProfileService.createProfile(this.form);

    request.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.hasProfile.set(true);
        this.successMessage.set('บันทึกโปรไฟล์สำเร็จ');
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(typeof err.error === 'string' ? err.error : 'บันทึกไม่สำเร็จ กรุณาลองใหม่');
      }
    });
  }

  deleteProfile() {
    if (!confirm('ยืนยันการลบโปรไฟล์? ข้อมูลนี้จะถูกใช้ในระบบแนะนำงานหายไปด้วย')) return;

    this.candidateProfileService.deleteProfile().subscribe({
      next: () => {
        this.hasProfile.set(false);
        this.form = { fullName: '', skills: '', expectedSalary: 0, experienceYears: 0, preferredLocation: '' };
        this.successMessage.set('ลบโปรไฟล์สำเร็จ');
      },
      error: () => this.errorMessage.set('ลบโปรไฟล์ไม่สำเร็จ กรุณาลองใหม่')
    });
  }
}
