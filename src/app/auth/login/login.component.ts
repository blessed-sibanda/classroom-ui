import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UiService } from 'src/app/common/ui.service';
import { SubSink } from 'subsink';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  loginError: string | undefined;
  subs = new SubSink();
  redirectUrl: string | null | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private uiService: UiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.subs.sink = route.queryParamMap.subscribe(
      (params) => (this.redirectUrl = params.get('redirectUrl'))
    );
  }

  ngOnInit(): void {
    this.authService.logout();
    this.buildLoginForm();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  buildLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  async login(submittedForm: FormGroup) {
    this.subs.sink = this.authService
      .login(submittedForm.value.email, submittedForm.value.password)
      .subscribe({
        error: (err) => (this.loginError = err.message),
        next: () => {
          let authStatus = this.authService.authStatus$.getValue();
          let user = this.authService.currentUser$.getValue();
          if (authStatus.isAuthenticated && user?._id !== '') {
            this.uiService.showToast(`Welcome ${user.name}!`);
            this.router.navigate([this.redirectUrl || '/home']);
          }
        },
      });
  }
}
