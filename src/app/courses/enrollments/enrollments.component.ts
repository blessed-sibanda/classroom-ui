import { Component, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { AuthService } from 'src/app/auth/auth.service';
import { SubSink } from 'subsink';
import { Enrollment } from '../enrollment';
import { EnrollmentService } from '../enrollment.service';

@Component({
  selector: 'app-enrollments',
  templateUrl: './enrollments.component.html',
  styleUrls: ['./enrollments.component.scss'],
})
export class EnrollmentsComponent implements OnInit {
  enrollments: Enrollment[] = [];
  subs = new SubSink();

  constructor(
    private enrollmentService: EnrollmentService,
    public media: MediaObserver,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.syncData();
  }

  syncData() {
    this.subs.add(
      this.enrollmentService.listEnrollments().subscribe({
        next: (res) => {
          this.enrollments = res;
        },
      })
    );
  }
}
