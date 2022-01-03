import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { transformError } from '../common/common';
import { IUser, User } from '../user/user';
import { AuthService, IAuthStatus, IServerAuthResponse } from './auth.service';

interface IJwtToken {
  email: string;
  id: string;
  iat: string;
  exp: string;
}

@Injectable()
export class CustomAuthService extends AuthService {
  constructor(private httpClient: HttpClient) {
    super();
  }

  protected authProvider(
    email: string,
    password: string
  ): Observable<IServerAuthResponse> {
    return this.httpClient.post<IServerAuthResponse>(
      `${environment.baseApiUrl}/auth/login`,
      { email, password }
    );
  }

  protected transformJwtToken(token: IJwtToken): IAuthStatus {
    return {
      isAuthenticated: token.email ? true : false,
      userId: token.id,
    } as IAuthStatus;
  }

  getCurrentUser(): Observable<User> {
    return this.httpClient
      .get<IUser>(`${environment.baseApiUrl}/auth/me`)
      .pipe(map(User.Build), catchError(transformError));
  }
}
