import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root',
})
export class SideNavigationService {
  private sideNav!: MatSidenav;

  constructor() {}

  setSideNav(sideNav: MatSidenav) {
    this.sideNav = sideNav;
  }

  open() {
    this.sideNav.open();
  }

  close() {
    this.sideNav.close();
  }
}
