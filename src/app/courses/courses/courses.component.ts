import { Component, OnDestroy, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { Course } from '../course';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit, OnDestroy {
  courses: Course[] = [];
  subs = new SubSink();

  constructor(private courseService: CourseService) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.subs.sink = this.courseService.getPublishedCourses().subscribe({
      next: (res) => {
        this.courses = res;
      },
    });
  }
}
