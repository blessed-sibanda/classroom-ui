import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/user/user';
import { SubSink } from 'subsink';
import { Course } from '../course';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
})
export class CourseComponent implements OnInit, OnDestroy {
  course!: Course;
  currentUser!: User;
  subs = new SubSink();

  constructor(
    private route: ActivatedRoute,
    public media: MediaObserver,
    private authService: AuthService
  ) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.course = this.route.snapshot.data['course'];
    this.subs.sink = this.authService.currentUser$
      .pipe(tap((user) => (this.currentUser = user)))
      .subscribe();
  }
}
