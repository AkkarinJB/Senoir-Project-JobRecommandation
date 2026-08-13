import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployerSidebarComponent } from '../employer-sidebar/employer-sidebar.component';

@Component({
  selector: 'app-employer-layout',
  standalone: true,
  imports: [RouterOutlet, EmployerSidebarComponent],
  templateUrl: './employer-layout.component.html'
})
export class EmployerLayoutComponent {}
