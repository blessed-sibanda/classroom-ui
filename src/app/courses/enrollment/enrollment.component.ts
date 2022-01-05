import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
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
import { Enrollment, ILessonStatus } from '../enrollment';
import { EnrollmentService } from '../enrollment.service';

@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.scss'],
})
export class EnrollmentComponent implements OnInit, OnDestroy {
  enrollment: Enrollment = new Enrollment('', new Course(), new User(), []);
  subs = new SubSink();
  selectedLesson: ILessonStatus | null | undefined;
  checked = true;

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

  selectItem(item: ILessonStatus | null) {
    this.selectedLesson = item;
  }

  markComplete(lessonStatus: ILessonStatus) {
    let action = !lessonStatus.complete
      ? () =>
          this.enrollmentService.completeLesson(
            this.enrollment._id,
            lessonStatus._id
          )
      : () =>
          this.enrollmentService.unCompleteLesson(
            this.enrollment._id,
            lessonStatus._id
          );
    action().subscribe({
      next: () => {
        this.uiService.showToast(
          `You have ${lessonStatus.complete ? 'uncompleted' : 'completed'}: ${
            lessonStatus.lesson.title
          }`
        );
        this.syncData();
        if (this.selectedLesson)
          this.selectedLesson.complete = !this.selectedLesson?.complete;
      },
      error: (err) => this.uiService.showToast(err.message),
    });
  }

  syncData() {
    this.subs.add(
      this.route.params.subscribe({
        next: (params) => {
          this.enrollmentService
            .getEnrollment(params['enrollmentId'])
            .subscribe({
              next: (res) => {
                console.log('res', res);
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

  ngOnInit(): void {
    this.syncData();
  }
}
