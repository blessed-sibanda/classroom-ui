import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { transformError } from '../common/common';
import { Course, ICourse } from './course';

export interface ICourseData {
  name: string;
  description: string;
  category?: string;
  file?: File;
}

export interface ILessonData {
  title: string;
  content: string;
  resourceUrl?: string;
}

interface ICourseService {
  currentCourse$: BehaviorSubject<Course>;
  createCourse(data: ICourseData): Observable<Course>;
  getInstructorCourses(instructorId: string): Observable<Course[]>;
  getCourse(courseId: string): Observable<Course>;
  createLesson(courseId: string, data: ILessonData): Observable<Course>;
}

@Injectable({
  providedIn: 'root',
})
export class CourseService implements ICourseService {
  currentCourse$ = new BehaviorSubject<Course>(new Course());

  constructor(private httpClient: HttpClient) {}

  createLesson(courseId: string, data: ILessonData): Observable<Course> {
    return this.httpClient
      .post<ICourse>(
        `${environment.baseApiUrl}/courses/${courseId}/lessons`,
        data
      )
      .pipe(
        map(Course.Build),
        catchError(transformError),
        tap((c) => this.currentCourse$.next(c))
      );
  }

  getCourse(courseId: string): Observable<Course> {
    return this.httpClient
      .get<ICourse>(`${environment.baseApiUrl}/courses/${courseId}`)
      .pipe(
        map(Course.Build),
        catchError(transformError),
        tap((c) => this.currentCourse$.next(c))
      );
  }

  getInstructorCourses(instructorId: string): Observable<Course[]> {
    return this.httpClient
      .get<ICourse[]>(
        `${environment.baseApiUrl}/courses/instructor/${instructorId}`
      )
      .pipe(map(Course.BuildMany), catchError(transformError));
  }

  createCourse(data: ICourseData): Observable<Course> {
    let formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    data.category && formData.append('category', data.category);
    data.file && formData.append('file', data.file);

    return this.httpClient
      .post<ICourse>(`${environment.baseApiUrl}/courses`, formData)
      .pipe(map(Course.Build), catchError(transformError));
  }
}
