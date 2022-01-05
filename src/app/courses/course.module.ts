import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseRoutingModule } from './course-routing.module';
import { NewCourseComponent } from './new-course/new-course.component';
import { MyCoursesComponent } from './my-courses/my-courses.component';
import { CourseComponent } from './course/course.component';
import { AppMaterialModule } from 'src/app/app-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgpImagePickerModule } from 'ngp-image-picker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewLessonComponent } from './new-lesson/new-lesson.component';
import { CourseResolve } from './course.resolve';
import { EditCourseComponent } from './edit-course/edit-course.component';
import { EnrollmentComponent } from './enrollment/enrollment.component';

@NgModule({
  declarations: [
    NewCourseComponent,
    MyCoursesComponent,
    CourseComponent,
    NewLessonComponent,
    EditCourseComponent,
    EnrollmentComponent,
  ],
  imports: [
    CommonModule,
    CourseRoutingModule,
    AppMaterialModule,
    FlexLayoutModule,
    NgpImagePickerModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [CourseResolve],
})
export class CourseModule {}
