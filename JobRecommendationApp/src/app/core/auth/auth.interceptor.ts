import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

// endpoint ที่ไม่ต้องแนบ token / ไม่ต้อง trigger refresh-retry ตอนโดน 401 (401 จากตรงนี้แปลว่า username/password ผิด ไม่ใช่ token หมดอายุ)
const AUTH_ENDPOINTS = ['/Auth/login', '/Auth/register', '/Auth/refresh'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isApiRequest = req.url.startsWith(environment.apiUrl);
  const isAuthEndpoint = AUTH_ENDPOINTS.some((path) => req.url.includes(path));

  const token = authService.getAccessToken();
  const authorizedReq =
    isApiRequest && !isAuthEndpoint && token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(authorizedReq).pipe(
    catchError((error: unknown) => {
      const is401 = error instanceof HttpErrorResponse && error.status === 401;

      // ไม่ retry ถ้าไม่ใช่ 401, ไม่ใช่ request ไป API ของเรา, หรือเป็น endpoint auth เอง (กัน infinite loop กับ /refresh)
      if (!is401 || !isApiRequest || isAuthEndpoint) {
        return throwError(() => error);
      }

      return authService.refreshAccessToken().pipe(
        switchMap((result) => {
          if (!result) {
            router.navigate(['/login']);
            return throwError(() => error);
          }

          const retriedReq = req.clone({ setHeaders: { Authorization: `Bearer ${result.token}` } });
          return next(retriedReq);
        })
      );
    })
  );
};
