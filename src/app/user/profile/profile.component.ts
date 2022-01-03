import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { UiService } from 'src/app/common/ui.service';
import { SubSink } from 'subsink';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  user!: User;
  currentUser!: User;
  subs = new SubSink();

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private uiService: UiService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.user = this.route.snapshot.data['user'];
  }

  isOwner() {
    return this.user._id === this.authService.currentUser$.getValue()._id;
  }

  deleteAccount(userId: string) {
    const dialog = this.uiService.showDialog(
      'Delete Account',
      'Confirm to delete account',
      'Confirm',
      'Cancel'
    );
    this.subs.sink = dialog.subscribe((result) => {
      if (result) {
        this.userService.deleteUser(userId).subscribe({
          next: () => {
            this.uiService.showToast('Account successfully deleted');
            this.authService.logout();
            this.router.navigate(['/home']);
          },
          error: (err) => this.uiService.showToast(err.message),
        });
      }
    });
  }
}
