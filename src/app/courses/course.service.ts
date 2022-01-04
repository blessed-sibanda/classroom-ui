import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { transformError } from '../common/common';
import { Course, ICourse } from './course';

export interface ILessonData {
  _id?: string;
  title: string;
  content: string;
  order: number;
  resourceUrl?: string;
}

export interface ICourseData {
  name: string;
  description: string;
  category?: string;
  file?: File;
  lessons?: ILessonData[];
  published: true;
}

interface ICourseService {
  currentCourse$: BehaviorSubject<Course>;
  createCourse(data: ICourseData): Observable<Course>;
  updateCourse(courseId: string, data: ICourseData): Observable<Course>;
  getInstructorCourses(instructorId: string): Observable<Course[]>;
  getPublishedCourses(): Observable<Course[]>;
  getCourse(courseId: string): Observable<Course>;
  deleteLesson(courseId: string, lessonId: string): Observable<Course>;
  deleteCourse(courseId: string): Observable<void>;
  createLesson(courseId: string, data: ILessonData): Observable<Course>;
}

@Injectable({
  providedIn: 'root',
})
export class CourseService implements ICourseService {
  currentCourse$ = new BehaviorSubject<Course>(new Course());

  constructor(private httpClient: HttpClient) {}

  getPublishedCourses(): Observable<Course[]> {
    return this.httpClient
      .get<ICourse[]>(`${environment.baseApiUrl}/courses`)
      .pipe(map(Course.BuildMany), catchError(transformError));
  }

  deleteCourse(courseId: string): Observable<void> {
    return this.httpClient
      .delete<void>(`${environment.baseApiUrl}/courses/${courseId}`)
      .pipe(catchError(transformError));
  }

  deleteLesson(courseId: string, lessonId: string): Observable<Course> {
    return this.httpClient
      .delete<ICourse>(
        `${environment.baseApiUrl}/courses/${courseId}/lessons/${lessonId}`
      )
      .pipe(
        map(Course.Build),
        catchError(transformError),
        tap((c) => this.currentCourse$.next(c))
      );
  }

  updateCourse(courseId: string, data: ICourseData): Observable<Course> {
    let formData = new FormData();
    data.name && formData.append('name', data.name);
    data.description && formData.append('description', data.description);
    data.category && formData.append('category', data.category);
    data.published && formData.append('published', data.published.toString());
    data.file && formData.append('file', data.file);
    data.lessons && formData.append('lessons', JSON.stringify(data.lessons));

    return this.httpClient
      .put<ICourse>(`${environment.baseApiUrl}/courses/${courseId}`, formData)
      .pipe(
        map(Course.Build),
        tap((c) => this.currentCourse$.next(c)),
        catchError(transformError)
      );
  }

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
