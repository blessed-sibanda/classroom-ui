import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { transformError } from '../common/common';
import { Enrollment, IEnrollment } from './enrollment';

export interface IEnrollmentStats {
  totalEnrolled: number;
  totalCompleted: number;
}
interface IEnrollmentService {
  enrollments$: BehaviorSubject<Enrollment[]>;
  enroll(courseId: string): Observable<Enrollment>;
  unEnroll(enrollmentId: string): Observable<void>;

  getEnrollment(enrollmentId: string): Observable<Enrollment>;
  listEnrollments(): Observable<Enrollment[]>;
  completeLesson(
    enrollmentId: string,
    lessonStatusId: string
  ): Observable<void>;
  unCompleteLesson(
    enrollmentId: string,
    lessonStatusId: string
  ): Observable<void>;
  getEnrollmentStats(courseId: string): Observable<IEnrollmentStats>;
}

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService implements IEnrollmentService {
  enrollments$ = new BehaviorSubject<Enrollment[]>([]);

  constructor(private httpClient: HttpClient) {}

  unEnroll(enrollmentId: string): Observable<void> {
    return this.httpClient.delete<void>(
      `${environment.baseApiUrl}/enrollments/${enrollmentId}`
    );
  }

  getEnrollmentStats(courseId: string): Observable<IEnrollmentStats> {
    return this.httpClient.get<IEnrollmentStats>(
      `${environment.baseApiUrl}/enrollments/${courseId}/stats`
    );
  }

  listEnrollments(): Observable<Enrollment[]> {
    return this.httpClient
      .get<IEnrollment[]>(`${environment.baseApiUrl}/enrollments`)
      .pipe(
        map(Enrollment.BuildMany),
        tap((d) => this.enrollments$.next(d)),
        catchError(transformError)
      );
  }

  completeLesson(
    enrollmentId: string,
    lessonStatusId: string
  ): Observable<void> {
    return this.httpClient.put<void>(
      `${environment.baseApiUrl}/enrollments/${enrollmentId}/complete/${lessonStatusId}`,
      {}
    );
  }
  unCompleteLesson(
    enrollmentId: string,
    lessonStatusId: string
  ): Observable<void> {
    return this.httpClient.delete<void>(
      `${environment.baseApiUrl}/enrollments/${enrollmentId}/complete/${lessonStatusId}`,
      {}
    );
  }

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
      .pipe(
        map(Enrollment.Build),
        tap((d) =>
          this.enrollments$.next([...this.enrollments$.getValue(), d])
        ),
        catchError(transformError)
      );
  }
}
