import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { UiService } from 'src/app/common/ui.service';
import { User } from 'src/app/user/user';
import { SubSink } from 'subsink';
import { Course, ILesson } from '../course';
import { CourseService, ICourseData } from '../course.service';
import { Enrollment } from '../enrollment';
import { EnrollmentService, IEnrollmentStats } from '../enrollment.service';
import { NewLessonComponent } from '../new-lesson/new-lesson.component';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
})
export class CourseComponent implements OnInit, OnDestroy {
  course!: Course;
  currentUser!: User;
  subs = new SubSink();
  lessons!: ILesson[];
  enrollmentStats!: IEnrollmentStats;
  isEnrolled!: boolean;

  constructor(
    private route: ActivatedRoute,
    public media: MediaObserver,
    private authService: AuthService,
    private uiService: UiService,
    private courseService: CourseService,
    private router: Router,
    private enrollmentService: EnrollmentService
  ) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  syncData() {
    this.course = this.route.snapshot.data['course'];
    this.lessons = this.course.lessons.sort((a, b) => a.order - b.order);
    this.subs.sink = combineLatest([
      this.authService.currentUser$,
      this.courseService.currentCourse$,
      this.enrollmentService.getEnrollmentStats(this.course._id),
    ])
      .pipe(
        tap(([user, course, stats]) => {
          this.currentUser = user;
          this.course = course;
          this.lessons = this.course.lessons;
          this.enrollmentStats = stats;
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.syncData();
  }

  deleteCourse() {
    const dialog = this.uiService.showDialog(
      `Delete ${this.course.name}`,
      `Confirm to delete your course ${this.course.name}`,
      'Confirm',
      'Cancel'
    );
    this.subs.sink = dialog.subscribe((result) => {
      if (result) {
        this.courseService.deleteCourse(this.course._id).subscribe({
          next: () => {
            this.uiService.showToast('Course deleted successfully', 'Close', {
              duration: 2000,
            });
            this.router.navigate(['/teach/courses']);
          },
          error: (err) => this.uiService.showToast(err.message),
        });
      }
    });
  }

  publishCourse() {
    const dialog = this.uiService.showDialog(
      'Publish Course',
      `Publishing your course will make it live to students ` +
        `for enrollment. Make sure all lessons are added and ready for publishing.`,
      'Publish',
      'Cancel'
    );
    this.subs.sink = dialog.subscribe((result) => {
      if (result) {
        this.courseService
          .updateCourse(this.course._id, { published: true } as ICourseData)
          .subscribe({
            next: (res) => {
              console.log(res);
              this.uiService.showToast(
                'Course published successfully',
                'Close',
                {
                  duration: 2000,
                }
              );
            },
            error: (err) => this.uiService.showToast(err.message),
          });
      }
    });
  }

  enroll() {
    this.subs.add(
      this.authService.authStatus$.subscribe({
        next: (authStatus) => {
          if (!authStatus.isAuthenticated) {
            let result = this.uiService.showDialog(
              'Enroll',
              'Sign in / Sign up to enroll',
              'Sign In',
              'Cancel'
            );
            result.subscribe({
              next: (res) => {
                if (res) this.router.navigate(['/login']);
              },
            });
          } else {
            this.enrollmentService.enroll(this.course._id).subscribe({
              next: (res) => {
                this.uiService.showToast('You have successfully enrolled');
                this.router.navigate([`/classes/${res._id}`]);
              },
              error: (err) => this.uiService.showToast(err.message),
            });
          }
        },
      })
    );
  }

  openNewLessonDialog() {
    this.uiService.showComponentDialog(NewLessonComponent, this.course);
  }
}
