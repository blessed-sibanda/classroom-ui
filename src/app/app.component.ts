import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { SideNavigationService } from './core/side-navigation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('sidenav') public sideNav!: MatSidenav;

  constructor(
    public media: MediaObserver,
    public sideNavService: SideNavigationService,
    public authService: AuthService
  ) {}

  ngAfterViewInit(): void {
    this.sideNavService.setSideNav(this.sideNav);
  }
}
