import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { SideNavigationService } from '../side-navigation.service';

@Component({
  selector: 'app-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.scss'],
})
export class SideNavigationComponent {
  constructor(
    private sideNavService: SideNavigationService,
    public authService: AuthService
  ) {}

  closeMenu() {
    this.sideNavService.close();
  }
}
