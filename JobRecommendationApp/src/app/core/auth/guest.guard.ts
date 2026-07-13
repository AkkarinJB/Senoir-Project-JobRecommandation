import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// ใช้กับหน้า /login, /register — login อยู่แล้วไม่ควรเห็นหน้าพวกนี้อีก เด้งไปหน้าแรกของ role ตัวเองแทน
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return router.createUrlTree([authService.homePathForRole(authService.role())]);
  }

  return true;
};
