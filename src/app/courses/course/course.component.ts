import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { UiService } from 'src/app/common/ui.service';
import { User } from 'src/app/user/user';
import { SubSink } from 'subsink';
import { Course, ILesson } from '../course';
import { CourseService } from '../course.service';
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

  constructor(
    private route: ActivatedRoute,
    public media: MediaObserver,
    private authService: AuthService,
    private uiService: UiService,
    private courseService: CourseService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.course = this.route.snapshot.data['course'];
    this.lessons = this.course.lessons.sort((a, b) => a.order - b.order);
    this.subs.sink = combineLatest([
      this.authService.currentUser$,
      this.courseService.currentCourse$,
    ])
      .pipe(
        tap(([user, course]) => {
          this.currentUser = user;
          this.course = course;
          this.lessons = this.course.lessons;
        })
      )
      .subscribe();
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

  openNewLessonDialog() {
    this.uiService.showComponentDialog(NewLessonComponent, this.course);
  }
}
