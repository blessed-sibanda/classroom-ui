import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { ActivatedRoute, Router } from '@angular/router';
import { UiService } from 'src/app/common/ui.service';
import { User } from 'src/app/user/user';
import { SubSink } from 'subsink';
import { Course } from '../course';
import { Enrollment, ILessonStatus } from '../enrollment';
import { EnrollmentService, IEnrollmentStats } from '../enrollment.service';

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
  completedLessonsCount = 0;
  enrollmentStats!: IEnrollmentStats;

  constructor(
    private enrollmentService: EnrollmentService,
    private route: ActivatedRoute,
    public media: MediaObserver,
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
                this.completedLessonsCount =
                  this.enrollment.lessonStatus.filter((l) => l.complete).length;
                this.enrollmentService
                  .getEnrollmentStats(this.enrollment.course._id)
                  .subscribe({ next: (res) => (this.enrollmentStats = res) });
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

  unEnroll() {
    const dialog = this.uiService.showDialog(
      'Un Enroll?',
      `Are you sure you want to un-enroll from: ${this.enrollment.course.name}`,
      'Confirm',
      'Cancel'
    );
    this.subs.add(
      dialog.subscribe((result) => {
        if (result) {
          this.enrollmentService.unEnroll(this.enrollment._id).subscribe({
            next: () => {
              this.uiService.showToast('You have successfully un-enrolled');
              this.router.navigate(['/home']);
            },
            error: (err) => this.uiService.showToast(err.message),
          });
        }
      })
    );
  }

  ngOnInit(): void {
    this.syncData();
  }
}
