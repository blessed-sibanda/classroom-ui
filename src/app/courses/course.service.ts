import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { transformError } from '../common/common';
import { Course, ICourse } from './course';

export interface ICourseData {
  name: string;
  description: string;
  category?: string;
  file?: File;
}

interface ICourseService {
  createCourse(data: ICourseData): Observable<Course>;
}

@Injectable({
  providedIn: 'root',
})
export class CourseService implements ICourseService {
  constructor(private httpClient: HttpClient) {}

  createCourse(data: ICourseData): Observable<Course> {
    let formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    data.category && formData.append('category', data.category);
    data.file && formData.append('name', data.file);

    return this.httpClient
      .post<ICourse>(`${environment.baseApiUrl}/api/courses`, formData)
      .pipe(map(Course.Build), catchError(transformError));
  }
}
