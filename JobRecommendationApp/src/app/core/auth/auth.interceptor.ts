import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

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
