import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { CourseService } from './course.service';
import { Course, ICourse } from './course';

@Injectable()
export class CourseResolve implements Resolve<ICourse> {
  constructor(private courseService: CourseService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): ICourse | Observable<ICourse> | Promise<ICourse> {
    const courseId = route.paramMap.get('courseId');
    return courseId ? this.courseService.getCourse(courseId) : new Course();
  }
}
