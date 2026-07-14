import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="flex flex-col w-64 h-screen bg-brand-950 text-brand-100 transition-all duration-300">

      <!-- Admin Header -->
      <div class="flex items-center justify-center h-16 bg-brand-950 border-b border-brand-800">
        <span class="text-white font-bold text-lg uppercase tracking-wider">Udonthani.link</span>
      </div>

      <!-- Navigation Menu -->
      <nav class="flex-1 overflow-y-auto py-4 space-y-1 px-3">

        <a routerLink="/admin/dashboard"
           routerLinkActive="sidebar-link-active"
           class="sidebar-link">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          Dashboard
        </a>

        <a routerLink="/admin/manage-jobs"
           routerLinkActive="sidebar-link-active"
           class="sidebar-link">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          จัดการโพสต์งาน
        </a>

        <a routerLink="/admin/employers"
           routerLinkActive="sidebar-link-active"
           class="sidebar-link">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          ยืนยันตัวตนผู้ประกอบการ
        </a>

        <a routerLink="/admin/categories"
           routerLinkActive="sidebar-link-active"
           class="sidebar-link">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
          หมวดหมู่งาน
        </a>

      </nav>

      <div class="p-4 border-t border-brand-800">
        <button (click)="logout()" class="flex items-center w-full px-4 py-2 text-sm text-red-400 rounded-lg hover:bg-red-500/10 hover:text-red-300 transition-colors">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          ออกจากระบบ
        </button>
      </div>

    </aside>
  `
})
export class AdminSidebarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }
}
