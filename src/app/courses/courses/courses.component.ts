import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { combineLatest, tap } from 'rxjs';
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
    public media: MediaObserver,
    private enrollmentService: EnrollmentService
  ) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.enrollmentService.enrollments$.next([]);
    this.subs.add(
      combineLatest([
        this.courseService.getPublishedCourses(),
        this.enrollmentService.enrollments$,
      ])
        .pipe(
          tap(([courses, enrollments]) => {
            let enrolledCourses = enrollments.filter((e) => e.course._id);
            this.courses = courses.filter(
              (c) => !enrolledCourses.map((e) => e.course._id).includes(c._id)
            );
          })
        )
        .subscribe()
    );
  }
}
