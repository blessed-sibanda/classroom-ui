import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UiService } from 'src/app/common/ui.service';
import { SubSink } from 'subsink';

import { ISignUp, IUser } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit, OnDestroy {
  signUpForm!: FormGroup;
  signUpError: string | undefined;
  subs = new SubSink();

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private uiService: UiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  buildForm() {
    this.signUpForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  signUp(user: ISignUp) {
    this.subs.add(
      this.userService.signUp(user).subscribe({
        next: (res: IUser) => {
          this.uiService.showDialog(
            'Sign Up ',
            'You have signed up successfully. \n You can now login',
            'Login'
          );
          this.router.navigate(['/login']);
        },
        error: (err) => (this.signUpError = err.message),
      })
    );
  }
}
