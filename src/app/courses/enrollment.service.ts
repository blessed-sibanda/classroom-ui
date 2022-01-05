import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { transformError } from '../common/common';
import { Enrollment, IEnrollment } from './enrollment';

interface IEnrollmentService {
  enroll(courseId: string): Observable<Enrollment>;
  getEnrollment(enrollmentId: string): Observable<Enrollment>;
}

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService implements IEnrollmentService {
  constructor(private httpClient: HttpClient) {}

  getEnrollment(enrollmentId: string): Observable<Enrollment> {
    return this.httpClient
      .get<IEnrollment>(`${environment.baseApiUrl}/enrollments/${enrollmentId}`)
      .pipe(map(Enrollment.Build), catchError(transformError));
  }

  enroll(courseId: string): Observable<Enrollment> {
    return this.httpClient
      .post<IEnrollment>(
        `${environment.baseApiUrl}/enrollments/${courseId}`,
        {}
      )
      .pipe(map(Enrollment.Build), catchError(transformError));
  }
}
