import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { IUser } from './user';
import { UserService } from './user.service';

@Injectable()
export class UserResolve implements Resolve<IUser> {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): IUser | Observable<IUser> | Promise<IUser> {
    const userId = route.paramMap.get('userId');
    if (userId) {
      return this.userService.getUser(userId);
    } else {
      return this.authService.getCurrentUser();
    }
  }
}
