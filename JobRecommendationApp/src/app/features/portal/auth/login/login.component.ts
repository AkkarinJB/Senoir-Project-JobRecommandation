import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { FormPageBase } from '../../../../shared/base/form-page-base';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent extends FormPageBase {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  username = '';
  password = '';

  submit() {
    if (!this.username || !this.password) return;

    this.isSubmitting.set(true);
    this.clearMessages();

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        this.router.navigateByUrl(returnUrl ?? this.authService.homePathForRole(res.role));
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.setError(err, 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่');
      }
    });
  }
}
