import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { SubSink } from 'subsink';
import { Course } from '../course';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.scss'],
})
export class MyCoursesComponent implements OnInit, OnDestroy {
  courses: Course[] = [];
  subs = new SubSink();

  constructor(
    private courseService: CourseService,
    private authService: AuthService
  ) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.subs.sink = this.authService.currentUser$.subscribe({
      next: (user) => {
        this.courseService.getInstructorCourses(user._id).subscribe({
          next: (res) => {
            this.courses = res;
            console.log('Courses -->', this.courses);
          },
        });
      },
    });
  }
}
