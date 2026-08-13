import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmployerProfileService } from '../../../core/services/employer-profile.service';
import { EmployerProfilePayload } from '../../../core/models/employer-profile.model';
import { FormPageBase } from '../../../shared/base/form-page-base';

@Component({
  selector: 'app-employer-company-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './employer-company-profile.component.html'
})
export class EmployerCompanyProfileComponent extends FormPageBase {
  private employerProfileService = inject(EmployerProfileService);

  hasProfile = signal(false);
  isVerified = signal(false);

  form: EmployerProfilePayload = {
    companyName: '',
    companyDescription: '',
    address: '',
    website: ''
  };

  constructor() {
    super();
    this.isLoading.set(true);

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
    this.clearMessages();

    const request = this.hasProfile()
      ? this.employerProfileService.updateProfile(this.form)
      : this.employerProfileService.createProfile(this.form);

    request.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.hasProfile.set(true);
        this.isVerified.set(false);
        this.setSuccess('บันทึกข้อมูลบริษัทสำเร็จ');
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.setError(err, 'บันทึกไม่สำเร็จ กรุณาลองใหม่');
      }
    });
  }
}
