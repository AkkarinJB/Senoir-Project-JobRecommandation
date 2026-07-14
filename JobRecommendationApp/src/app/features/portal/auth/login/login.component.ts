import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="card max-w-md mx-auto mt-8">
      <h1 class="page-title">เข้าสู่ระบบ</h1>

      <form (ngSubmit)="submit()" class="space-y-4">
        <div>
          <label class="form-label">ชื่อผู้ใช้</label>
          <input type="text" name="username" [(ngModel)]="username" required class="form-input" />
        </div>

        <div>
          <label class="form-label">รหัสผ่าน</label>
          <input type="password" name="password" [(ngModel)]="password" required class="form-input" />
        </div>

        @if (errorMessage()) {
          <p class="form-error">{{ errorMessage() }}</p>
        }

        <button type="submit" [disabled]="isSubmitting()" class="btn-primary btn-block">
          {{ isSubmitting() ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
        </button>
      </form>

      <p class="text-sm text-muted mt-4 text-center">
        ยังไม่มีบัญชี? <a routerLink="/register" class="text-brand-600 hover:underline">สมัครสมาชิก</a>
      </p>
    </div>
  `
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  username = '';
  password = '';
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  submit() {
    if (!this.username || !this.password) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        this.router.navigateByUrl(returnUrl ?? this.authService.homePathForRole(res.role));
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(typeof err.error === 'string' ? err.error : 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่');
      }
    });
  }
}
