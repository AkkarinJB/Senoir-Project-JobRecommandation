import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-employer-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="flex flex-col w-64 h-screen bg-gray-900 text-gray-300">
      <div class="flex items-center justify-center h-16 bg-gray-950 border-b border-gray-800">
        <span class="text-white font-bold text-lg uppercase tracking-wider">Employer Panel</span>
      </div>

      <nav class="flex-1 overflow-y-auto py-4 space-y-1 px-3">
        <a routerLink="/employer/dashboard" routerLinkActive="sidebar-link-active"
           class="sidebar-link">
          Dashboard
        </a>
        <a routerLink="/employer/company-profile" routerLinkActive="sidebar-link-active"
           class="sidebar-link">
          ข้อมูลบริษัท
        </a>
        <a routerLink="/employer/jobs" routerLinkActive="sidebar-link-active"
           class="sidebar-link">
          ประกาศงานของฉัน
        </a>
      </nav>

      <div class="p-4 border-t border-gray-800">
        <button (click)="logout()" class="w-full text-left px-4 py-2 text-sm text-red-400 rounded-lg hover:bg-red-500/10 hover:text-red-300 transition-colors">
          ออกจากระบบ
        </button>
      </div>
    </aside>
  `
})
export class EmployerSidebarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }
}
