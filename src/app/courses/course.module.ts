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

@NgModule({
  declarations: [NewCourseComponent, MyCoursesComponent, CourseComponent, NewLessonComponent],
  imports: [
    CommonModule,
    CourseRoutingModule,
    AppMaterialModule,
    FlexLayoutModule,
    NgpImagePickerModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class CourseModule {}
