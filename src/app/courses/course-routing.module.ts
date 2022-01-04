import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { CourseResolve } from './course.resolve';
import { CourseComponent } from './course/course.component';
import { EditCourseComponent } from './edit-course/edit-course.component';
import { MyCoursesComponent } from './my-courses/my-courses.component';
import { NewCourseComponent } from './new-course/new-course.component';

const routes: Routes = [
  {
    path: 'course/:courseId',
    component: CourseComponent,
    canActivate: [AuthGuard],
    resolve: { course: CourseResolve },
  },
  {
    path: 'course/:courseId/edit',
    component: EditCourseComponent,
    canActivate: [AuthGuard],
    resolve: { course: CourseResolve },
  },
  {
    path: 'teach/courses',
    component: MyCoursesComponent,
    canActivate: [AuthGuard],
    data: { onlyInstructor: true },
  },
  {
    path: 'teach/courses/new',
    component: NewCourseComponent,
    canActivate: [AuthGuard],
    data: { onlyInstructor: true },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseRoutingModule {}
