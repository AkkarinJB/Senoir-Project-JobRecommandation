import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="card max-w-md mx-auto mt-8">
      <h1 class="page-title">สมัครสมาชิก</h1>

      <form (ngSubmit)="submit()" class="space-y-4">
        <div>
          <label class="form-label">สมัครในฐานะ</label>
          <div class="grid grid-cols-2 gap-3">
            <button type="button" (click)="role = 'JobSeeker'"
                    [class.btn-outline-active]="role === 'JobSeeker'"
                    class="btn-outline">
              ผู้หางาน
            </button>
            <button type="button" (click)="role = 'Employer'"
                    [class.btn-outline-active]="role === 'Employer'"
                    class="btn-outline">
              ผู้ประกอบการ
            </button>
          </div>
        </div>

        <div>
          <label class="form-label">ชื่อผู้ใช้</label>
          <input type="text" name="username" [(ngModel)]="username" required class="form-input" />
        </div>

        <div>
          <label class="form-label">อีเมล</label>
          <input type="email" name="email" [(ngModel)]="email" required class="form-input" />
        </div>

        <div>
          <label class="form-label">รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)</label>
          <input type="password" name="password" [(ngModel)]="password" required minlength="8" class="form-input" />
        </div>

        @if (errorMessage()) {
          <p class="form-error">{{ errorMessage() }}</p>
        }
        @if (successMessage()) {
          <p class="form-success">{{ successMessage() }}</p>
        }

        <button type="submit" [disabled]="isSubmitting()" class="btn-primary btn-block">
          {{ isSubmitting() ? 'กำลังสมัคร...' : 'สมัครสมาชิก' }}
        </button>
      </form>

      <p class="text-sm text-muted mt-4 text-center">
        มีบัญชีอยู่แล้ว? <a routerLink="/login" class="text-blue-600 hover:underline">เข้าสู่ระบบ</a>
      </p>
    </div>
  `
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  role: 'JobSeeker' | 'Employer' = 'JobSeeker';
  username = '';
  email = '';
  password = '';
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  submit() {
    if (!this.username || !this.email || !this.password) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.authService
      .register({ username: this.username, email: this.email, password: this.password, role: this.role })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.successMessage.set('สมัครสมาชิกสำเร็จ กำลังพาไปหน้าเข้าสู่ระบบ...');
          setTimeout(() => this.router.navigate(['/login']), 1200);
        },
        error: (err: HttpErrorResponse) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(typeof err.error === 'string' ? err.error : 'สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่');
        }
      });
  }
}
