import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';
import { User, IUser, ISignUp } from './user';
import { environment } from '../../environments/environment';
import { transformError } from '../common/common';

interface IUserService {
  signUp(userData: ISignUp): Observable<User>;
  getUsers(): Observable<User[]>;
  getUser(id: string | null): Observable<User>;
  deleteUser(id: string | null): Observable<any>;
  updateUser(id: string | null, data: object): Observable<User>;
}

@Injectable({
  providedIn: 'root',
})
export class UserService implements IUserService {
  constructor(private httpClient: HttpClient) {}

  deleteUser(id: string | null): Observable<any> {
    return this.httpClient.delete<any>(`${environment.baseApiUrl}/users/${id}`);
  }

  updateUser(id: string | null, data: object): Observable<User> {
    if (id === null) {
      return throwError(() => new Error('User id is not set'));
    }

    return this.httpClient.put<IUser>(
      `${environment.baseApiUrl}/users/${id}`,
      data
    );
  }

  getUser(id: string | null): Observable<User> {
    if (id === null) {
      return throwError(() => new Error('User id is not set'));
    }

    return this.httpClient
      .get<IUser>(`${environment.baseApiUrl}/users/${id}`)
      .pipe(map(User.Build), catchError(transformError));
  }

  getUsers(): Observable<User[]> {
    return this.httpClient
      .get<IUser[]>(`${environment.baseApiUrl}/users`)
      .pipe(map(User.BuildMany), catchError(transformError));
  }

  signUp(userData: ISignUp): Observable<User> {
    return this.httpClient
      .post<IUser>(`${environment.baseApiUrl}/users`, userData)
      .pipe(map(User.Build), catchError(transformError));
  }
}
