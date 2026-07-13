import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, CurrentUser, LoginPayload, RefreshResponse, RegisterPayload, UserRole } from '../models/auth.model';
import { isTokenExpired, parseCurrentUserFromToken } from './jwt.util';

const ACCESS_TOKEN_KEY = 'jr_access_token';
const REFRESH_TOKEN_KEY = 'jr_refresh_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/Auth`;

  // อ่าน token ที่ค้างอยู่ใน localStorage ตอนเปิดแอปใหม่ (refresh หน้าเว็บแล้ว session ไม่หาย)
  // ถ้า access token หมดอายุแล้วก็ยังตั้ง currentUser จาก token เดิมไปก่อน — interceptor จะ refresh ให้อัตโนมัติตอนเรียก API ครั้งแรก
  private currentUserSignal = signal<CurrentUser | null>(this.restoreUserFromStorage());

  currentUser = this.currentUserSignal.asReadonly();
  role = computed<UserRole | null>(() => this.currentUserSignal()?.role ?? null);
  isAuthenticated = computed(() => this.currentUserSignal() !== null);

  private restoreUserFromStorage(): CurrentUser | null {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) return null;
    return parseCurrentUserFromToken(token);
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const currentRole = this.role();
    return currentRole !== null && roles.includes(currentRole);
  }

  register(payload: RegisterPayload): Observable<{ message: string; userId: number; role: string }> {
    return this.http.post<{ message: string; userId: number; role: string }>(`${this.baseUrl}/register`, payload);
  }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, payload).pipe(
      tap((res) => this.setSession(res.token, res.refreshToken))
    );
  }

  private refreshInFlight$: Observable<RefreshResponse | null> | null = null;

  // interceptor เรียกตัวนี้ตอนเจอ 401 — คืน null ถ้า refresh ไม่สำเร็จ (แทนที่จะ throw เพื่อให้ interceptor เช็คง่าย ๆ)
  // ถ้ามีหลาย request โดน 401 พร้อมกัน ใช้ shareReplay ให้ยิง /refresh แค่ครั้งเดียวแล้วแชร์ผลลัพธ์ ไม่ยิงซ้ำซ้อน
  refreshAccessToken(): Observable<RefreshResponse | null> {
    if (this.refreshInFlight$) return this.refreshInFlight$;

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return of(null);

    this.refreshInFlight$ = this.http.post<RefreshResponse>(`${this.baseUrl}/refresh`, { refreshToken }).pipe(
      tap((res) => this.setSession(res.token, res.refreshToken)),
      catchError(() => {
        this.clearSession();
        return of(null);
      }),
      shareReplay(1),
      tap({ complete: () => (this.refreshInFlight$ = null) })
    );

    return this.refreshInFlight$;
  }

  logout(): Observable<unknown> {
    const refreshToken = this.getRefreshToken();
    this.clearSession();

    if (!refreshToken) return of(null);
    // ยิง revoke ที่ backend แบบ best-effort เคลียร์ local state ไปก่อนแล้วไม่ว่าผลจะเป็นยังไง
    return this.http.post(`${this.baseUrl}/logout`, { refreshToken }).pipe(catchError(() => of(null)));
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  isAccessTokenExpired(): boolean {
    const token = this.getAccessToken();
    return !token || isTokenExpired(token);
  }

  private setSession(accessToken: string, refreshToken: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    this.currentUserSignal.set(parseCurrentUserFromToken(accessToken));
  }

  // เคลียร์ session ในเครื่อง โดยไม่ยิง request ไป backend — ใช้ตอน refresh token ใช้ไม่ได้แล้ว (กัน loop)
  clearSession(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    this.currentUserSignal.set(null);
  }

  // path เริ่มต้นหลัง login สำเร็จ แยกตาม role
  homePathForRole(role: UserRole | null): string {
    switch (role) {
      case 'Admin':
        return '/admin';
      case 'Employer':
        return '/employer';
      case 'JobSeeker':
      default:
        return '/';
    }
  }
}
