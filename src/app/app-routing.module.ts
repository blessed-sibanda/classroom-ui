import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { HomeComponent } from './core/home/home.component';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';
import { LogoutComponent } from './auth/logout.component';
import { NewCourseComponent } from './courses/new-course/new-course.component';
import { MyCoursesComponent } from './courses/my-courses/my-courses.component';
import { AuthGuard } from './auth/auth.guard';
import { CourseComponent } from './courses/course/course.component';
import { CourseResolve } from './courses/course.resolve';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'logout', component: LogoutComponent },
  {
    path: 'courses/:courseId',
    component: CourseComponent,
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
  {
    path: '',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
