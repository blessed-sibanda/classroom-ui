import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

import { AuthService } from './auth.service'

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwt = this.authService.getToken()
    const authRequest = req.clone({
      setHeaders: { authorization: `Bearer ${jwt}` },
    })
    return next.handle(authRequest).pipe(
      catchError((err: HttpErrorResponse, caught) => {
        console.log(this.router.routerState.snapshot.url)
        if (err.status === 401) {
          if (
            !(
              this.router.routerState.snapshot.url.startsWith('/home') ||
              this.router.routerState.snapshot.url.startsWith('/login')
            )
          )
            this.router.navigate(['/login'], {
              queryParams: {
                redirectUrl: this.router.routerState.snapshot.url,
              },
            })
        }
        return throwError(() => err)
      })
    )
  }
}
