import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UiService } from '../common/ui.service';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-logout',
  template: ` <p>Logging out...</p> `,
  styles: [],
})
export class LogoutComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private uiService: UiService
  ) {}

  ngOnInit(): void {
    this.authService.logout();
    this.uiService.showToast('You have logged out');
    this.router.navigate(['/']);
  }
}
