import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { EmployerProfileService } from '../../../core/services/employer-profile.service';
import { EmployerProfilePayload } from '../../../core/models/employer-profile.model';

@Component({
  selector: 'app-employer-company-profile',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="card max-w-xl">
      <h1 class="page-title">ข้อมูลบริษัท</h1>

      @if (isLoading()) {
        <p class="text-muted">กำลังโหลด...</p>
      } @else {
        @if (hasProfile()) {
          @if (isVerified()) {
            <span class="inline-block bg-green-50 text-green-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
              ยืนยันตัวตนแล้ว
            </span>
          } @else {
            <span class="inline-block bg-amber-50 text-amber-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
              รอการยืนยันตัวตนจากผู้ดูแลระบบ
            </span>
          }
        } @else {
          <p class="text-sm text-muted mb-4">คุณยังไม่ได้สร้างข้อมูลบริษัท — กรอกด้านล่างเพื่อเริ่มลงประกาศงาน</p>
        }

        <form (ngSubmit)="submit()" class="space-y-4">
          <div>
            <label class="form-label">ชื่อบริษัท</label>
            <input type="text" name="companyName" [(ngModel)]="form.companyName" required class="form-input" />
          </div>

          <div>
            <label class="form-label">รายละเอียดบริษัท</label>
            <textarea name="companyDescription" [(ngModel)]="form.companyDescription" rows="3" class="form-input"></textarea>
          </div>

          <div>
            <label class="form-label">ที่อยู่</label>
            <input type="text" name="address" [(ngModel)]="form.address" class="form-input" />
          </div>

          <div>
            <label class="form-label">เว็บไซต์</label>
            <input type="text" name="website" [(ngModel)]="form.website" placeholder="https://..." class="form-input" />
          </div>

          @if (errorMessage()) {
            <p class="form-error">{{ errorMessage() }}</p>
          }
          @if (successMessage()) {
            <p class="form-success">{{ successMessage() }}</p>
          }

          <button type="submit" [disabled]="isSubmitting()" class="btn-primary">
            {{ isSubmitting() ? 'กำลังบันทึก...' : (hasProfile() ? 'บันทึกการแก้ไข' : 'สร้างข้อมูลบริษัท') }}
          </button>
        </form>
      }
    </div>
  `
})
export class EmployerCompanyProfileComponent {
  private employerProfileService = inject(EmployerProfileService);

  isLoading = signal(true);
  isSubmitting = signal(false);
  hasProfile = signal(false);
  isVerified = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  form: EmployerProfilePayload = {
    companyName: '',
    companyDescription: '',
    address: '',
    website: ''
  };

  constructor() {
    this.employerProfileService.getMyProfile().subscribe({
      next: (profile) => {
        this.hasProfile.set(true);
        this.isVerified.set(profile.isVerified);
        this.form = {
          companyName: profile.companyName,
          companyDescription: profile.companyDescription ?? '',
          address: profile.address ?? '',
          website: profile.website ?? ''
        };
        this.isLoading.set(false);
      },
      // 404 = ยังไม่เคยสร้างข้อมูลบริษัท ไม่ใช่ error จริง แสดงฟอร์มเปล่าให้กรอกใหม่
      error: () => this.isLoading.set(false)
    });
  }

  submit() {
    if (!this.form.companyName) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const request = this.hasProfile()
      ? this.employerProfileService.updateProfile(this.form)
      : this.employerProfileService.createProfile(this.form);

    request.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.hasProfile.set(true);
        // แก้ไขข้อมูลแล้ว backend จะรีเซ็ตสถานะยืนยันตัวตนเป็นยังไม่ verify เสมอ (กันสวมรอย) — สะท้อนสถานะนี้ในหน้าจอทันที
        this.isVerified.set(false);
        this.successMessage.set('บันทึกข้อมูลบริษัทสำเร็จ');
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(typeof err.error === 'string' ? err.error : 'บันทึกไม่สำเร็จ กรุณาลองใหม่');
      }
    });
  }
}
