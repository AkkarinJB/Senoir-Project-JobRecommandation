import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-portal-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './portal-navbar.component.html'
})
export class PortalNavbarComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.authService.logout().subscribe(() => this.router.navigate(['/']));
  }
}
