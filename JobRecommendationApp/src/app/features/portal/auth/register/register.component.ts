import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { FormPageBase } from '../../../../shared/base/form-page-base';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent extends FormPageBase {
  private authService = inject(AuthService);
  private router = inject(Router);

  role: 'JobSeeker' | 'Employer' = 'JobSeeker';
  username = '';
  email = '';
  password = '';

  submit() {
    if (!this.username || !this.email || !this.password) return;

    this.isSubmitting.set(true);
    this.clearMessages();

    this.authService
      .register({ username: this.username, email: this.email, password: this.password, role: this.role })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.setSuccess('สมัครสมาชิกสำเร็จ กำลังพาไปหน้าเข้าสู่ระบบ...');
          setTimeout(() => this.router.navigate(['/login']), 1200);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.setError(err, 'สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่');
        }
      });
  }
}
