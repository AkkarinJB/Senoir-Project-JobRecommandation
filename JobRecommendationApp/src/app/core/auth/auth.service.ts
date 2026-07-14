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

  clearSession(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    this.currentUserSignal.set(null);
  }

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
