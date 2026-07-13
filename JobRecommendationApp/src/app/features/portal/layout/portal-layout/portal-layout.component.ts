import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PortalNavbarComponent } from '../portal-navbar/portal-navbar.component';

@Component({
  selector: 'app-portal-layout',
  imports: [RouterOutlet, PortalNavbarComponent],
  templateUrl: './portal-layout.component.html',
  styleUrl: './portal-layout.component.css'
})
export class PortalLayoutComponent {

}
