import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { UiService } from 'src/app/common/ui.service';
import { User } from 'src/app/user/user';
import { SubSink } from 'subsink';
import { Course, ICourse, ILesson } from '../course';
import { Enrollment } from '../enrollment';
import { EnrollmentService } from '../enrollment.service';

@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.scss'],
})
export class EnrollmentComponent implements OnInit, OnDestroy {
  enrollment: Enrollment = new Enrollment('', new Course(), new User(), []);
  subs = new SubSink();
  selectedLesson: ILesson | null | undefined;

  constructor(
    private enrollmentService: EnrollmentService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private uiService: UiService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  selectItem(item: ILesson | null) {
    this.selectedLesson = item;
  }

  ngOnInit(): void {
    this.subs.add(
      this.route.params.subscribe({
        next: (params) => {
          this.enrollmentService
            .getEnrollment(params['enrollmentId'])
            .subscribe({
              next: (res) => {
                this.enrollment = res;
              },
              error: (err) => {
                this.uiService.showToast(err.message);
                this.router.navigate(['/home']);
              },
            });
        },
      })
    );
  }
}
