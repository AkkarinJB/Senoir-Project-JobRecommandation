import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { AlgorithmDemoService } from '../../../core/services/algorithm-demo.service';
import { JaccardDemoResult } from '../../../core/models/algorithm-demo.model';

interface DemoPreset {
  label: string;
  jobSkills: string;
  candidateSkills: string;
}


@Component({
  selector: 'app-algorithm-demo',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './algorithm-demo.component.html'
})
export class AlgorithmDemoComponent {
  private algorithmDemoService = inject(AlgorithmDemoService);

  jobSkillsInput = '';
  candidateSkillsInput = '';
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  result = signal<JaccardDemoResult | null>(null);

  presets: DemoPreset[] = [
    {
      label: 'ตัวอย่างจากเอกสาร (28.57%)',
      jobSkills: 'การนำเสนอสินค้า, การเจรจาต่อรอง, ขับรถยนต์ได้, จัดทำบัญชีเบื้องต้น, Microsoft Excel',
      candidateSkills: 'การนำเสนอสินค้า, ขับรถยนต์ได้, การบริการลูกค้า, สื่อสารภาษาอังกฤษ'
    },
    {
      label: 'Match สูง (83.33%)',
      jobSkills: 'HTML, CSS, JavaScript, Angular, Git',
      candidateSkills: 'HTML, CSS, JavaScript, Angular, Git, TypeScript'
    },
    {
      label: 'Match ปานกลาง (60%)',
      jobSkills: 'Java, Spring Boot, MySQL, Docker',
      candidateSkills: 'Java, Spring Boot, MySQL, Python'
    },
    {
      label: 'ไม่ตรงกันเลย (0%)',
      jobSkills: 'บัญชี, Excel, การเงิน, ภาษี, การตรวจสอบบัญชี',
      candidateSkills: 'การตลาด, การขาย, Photoshop'
    }
  ];

  constructor() {
    this.loadPreset(this.presets[0]);
  }

  loadPreset(preset: DemoPreset) {
    this.jobSkillsInput = preset.jobSkills;
    this.candidateSkillsInput = preset.candidateSkills;
    this.result.set(null);
  }

  calculate() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.algorithmDemoService
      .calculateJaccard({ jobSkills: this.jobSkillsInput, candidateSkills: this.candidateSkillsInput })
      .subscribe({
        next: (r) => {
          this.result.set(r);
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('คำนวณไม่สำเร็จ ตรวจสอบว่า backend เปิดอยู่หรือไม่');
          this.isLoading.set(false);
        }
      });
  }
}
