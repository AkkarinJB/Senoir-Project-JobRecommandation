import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployerSidebarComponent } from '../employer-sidebar/employer-sidebar.component';

@Component({
  selector: 'app-employer-layout',
  standalone: true,
  imports: [RouterOutlet, EmployerSidebarComponent],
  template: `
    <div class="flex h-screen bg-gray-100">
      <app-employer-sidebar />
      <main class="flex-1 p-8 overflow-y-auto">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class EmployerLayoutComponent {}
