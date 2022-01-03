import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { SubSink } from 'subsink';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  users: User[] = [];
  loading: boolean = true;
  subs = new SubSink();

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.subs.sink = combineLatest([
      this.authService.currentUser$,
      this.userService.getUsers(),
    ])
      .pipe(
        tap(([currentUser, users]) => {
          this.users = users.filter((u) => u._id !== currentUser._id);
          this.loading = false;
        })
      )
      .subscribe();
  }
}
