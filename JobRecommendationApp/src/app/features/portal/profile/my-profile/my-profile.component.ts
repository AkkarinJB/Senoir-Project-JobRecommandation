import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CandidateProfileService } from '../../../../core/services/candidate-profile.service';
import { CandidateProfilePayload } from '../../../../core/models/candidate-profile.model';
import { Skill } from '../../../../core/models/skill.model';
import { SkillChipSelectComponent } from '../../../../shared/skill-chip-select/skill-chip-select.component';
import { FormPageBase } from '../../../../shared/base/form-page-base';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [FormsModule, SkillChipSelectComponent],
  templateUrl: './my-profile.component.html'
})
export class MyProfileComponent extends FormPageBase {
  private candidateProfileService = inject(CandidateProfileService);

  hasProfile = signal(false);
  selectedSkills: Skill[] = [];

  form: CandidateProfilePayload = {
    fullName: '',
    skillIds: [],
    expectedSalary: 0,
    experienceYears: 0,
    preferredLocation: ''
  };

  constructor() {
    super();
    this.isLoading.set(true);
    this.candidateProfileService.getMyProfile().subscribe({
      next: (profile) => {
        this.hasProfile.set(true);
        this.selectedSkills = profile.skills;
        this.form = {
          fullName: profile.fullName,
          skillIds: profile.skills.map((s) => s.id),
          expectedSalary: profile.expectedSalary,
          experienceYears: profile.experienceYears,
          preferredLocation: profile.preferredLocation ?? ''
        };
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onSkillsChange(skills: Skill[]) {
    this.selectedSkills = skills;
    this.form.skillIds = skills.map((s) => s.id);
  }

  submit() {
    this.clearMessages();

    if (!this.form.fullName) {
      this.errorMessage.set('กรุณากรอกชื่อ-นามสกุล');
      return;
    }
    if (this.form.skillIds.length === 0) {
      this.errorMessage.set('กรุณาเพิ่มทักษะอย่างน้อย 1 รายการ (พิมพ์แล้วกด Enter หรือเลือกจากรายการ)');
      return;
    }

    this.isSubmitting.set(true);

    const request = this.hasProfile()
      ? this.candidateProfileService.updateProfile(this.form)
      : this.candidateProfileService.createProfile(this.form);

    request.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.hasProfile.set(true);
        this.setSuccess('บันทึกโปรไฟล์สำเร็จ');
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.setError(err, 'บันทึกไม่สำเร็จ กรุณาลองใหม่');
      }
    });
  }

  deleteProfile() {
    if (!confirm('ยืนยันการลบโปรไฟล์? ข้อมูลนี้จะถูกใช้ในระบบแนะนำงานหายไปด้วย')) return;

    this.candidateProfileService.deleteProfile().subscribe({
      next: () => {
        this.hasProfile.set(false);
        this.selectedSkills = [];
        this.form = { fullName: '', skillIds: [], expectedSalary: 0, experienceYears: 0, preferredLocation: '' };
        this.setSuccess('ลบโปรไฟล์สำเร็จ');
      },
      error: (err) => this.setError(err, 'ลบโปรไฟล์ไม่สำเร็จ กรุณาลองใหม่')
    });
  }
}
