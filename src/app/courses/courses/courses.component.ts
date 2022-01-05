import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { UiService } from 'src/app/common/ui.service';
import { SubSink } from 'subsink';
import { Course } from '../course';
import { CourseService } from '../course.service';
import { EnrollmentService } from '../enrollment.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit, OnDestroy {
  courses: Course[] = [];
  subs = new SubSink();

  constructor(
    private courseService: CourseService,
    private uiService: UiService,
    private authService: AuthService,
    private router: Router,
    public media: MediaObserver,
    private enrollmentService: EnrollmentService
  ) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.subs.add(
      this.courseService.getPublishedCourses().subscribe({
        next: (res) => {
          this.courses = res;
        },
      })
    );
  }

  enroll(courseId: string) {
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
            this.enrollmentService.enroll(courseId).subscribe({
              next: (res) => {
                console.log(res);
                this.uiService.showToast('You have successfully enrolled');
              },
              error: (err) => this.uiService.showToast(err.message),
            });
          }
        },
      })
    );
  }
}
