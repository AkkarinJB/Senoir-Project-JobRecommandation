import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { UserRole } from '../models/auth.model';

// ใช้แบบ roleGuard(['Admin']) หรือ roleGuard(['Employer', 'Admin']) เป็นต้น
// ยังไม่ login -> เด้งไป /login พร้อม returnUrl, login แล้วแต่ role ไม่ตรง -> เด้งกลับหน้าแรกของ role ตัวเอง
export function roleGuard(allowedRoles: UserRole[]): CanActivateFn {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }

    if (!authService.hasAnyRole(allowedRoles)) {
      return router.createUrlTree([authService.homePathForRole(authService.role())]);
    }

    return true;
  };
}
