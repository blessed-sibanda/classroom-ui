import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { ActivatedRoute } from '@angular/router';
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
    private courseService: CourseService
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
        })
      )
      .subscribe();
  }

  openNewLessonDialog() {
    this.uiService.showComponentDialog(NewLessonComponent, this.course);
  }
}
