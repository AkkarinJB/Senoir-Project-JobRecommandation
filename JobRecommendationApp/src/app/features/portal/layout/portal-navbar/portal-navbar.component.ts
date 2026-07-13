import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-portal-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">

          <!-- Logo & Main Links -->
          <div class="flex items-center gap-8">
            <a routerLink="/" class="text-2xl font-bold text-blue-600">JobPortal</a>

            <div class="hidden md:flex space-x-4">
              <a routerLink="/"
                 [routerLinkActiveOptions]="{ exact: true }"
                 routerLinkActive="text-blue-600 font-medium"
                 class="text-gray-600 hover:text-blue-600 transition-colors px-3 py-2">
                หน้าแรก
              </a>
              <a routerLink="/jobs"
                 routerLinkActive="text-blue-600 font-medium"
                 class="text-gray-600 hover:text-blue-600 transition-colors px-3 py-2">
                ค้นหางาน
              </a>
              @if (authService.role() === 'JobSeeker') {
                <a routerLink="/my-applications"
                   routerLinkActive="text-blue-600 font-medium"
                   class="text-gray-600 hover:text-blue-600 transition-colors px-3 py-2">
                  ใบสมัครของฉัน
                </a>
                <a routerLink="/my-profile"
                   routerLinkActive="text-blue-600 font-medium"
                   class="text-gray-600 hover:text-blue-600 transition-colors px-3 py-2">
                  โปรไฟล์ของฉัน
                </a>
              }
              @if (authService.role() === 'Employer') {
                <a routerLink="/employer"
                   class="text-gray-600 hover:text-blue-600 transition-colors px-3 py-2">
                  หน้าจัดการของฉัน
                </a>
              }
              @if (authService.role() === 'Admin') {
                <a routerLink="/admin"
                   class="text-gray-600 hover:text-blue-600 transition-colors px-3 py-2">
                  หน้าผู้ดูแลระบบ
                </a>
              }
            </div>
          </div>

          <!-- Auth Actions (เปลี่ยนตาม State) -->
          <div class="flex items-center space-x-4">
            @if (!authService.isAuthenticated()) {
              <a routerLink="/login" class="text-gray-600 hover:text-gray-900 font-medium px-4 py-2">
                เข้าสู่ระบบ
              </a>
              <a routerLink="/register" class="btn-primary">
                สมัครสมาชิก
              </a>
            } @else {
              <div class="flex items-center gap-4">
                <span class="text-sm text-muted">ยินดีต้อนรับ, {{ authService.currentUser()?.username }}</span>
                <button (click)="logout()" class="btn-ghost-danger">
                  ออกจากระบบ
                </button>
              </div>
            }
          </div>

        </div>
      </div>
    </nav>
  `
})
export class PortalNavbarComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.authService.logout().subscribe(() => this.router.navigate(['/']));
  }
}
