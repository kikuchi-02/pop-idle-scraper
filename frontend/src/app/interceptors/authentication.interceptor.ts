import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  private tokenRefreshed$ = new Subject<void>();

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const authReq = request.clone({
      headers: request.headers.set(
        'Authorization',
        `Bearer ${this.authenticationService.access}`
      ),
    });
    return next.handle(authReq).pipe(
      catchError((err) => {
        if (
          err.status === 401 &&
          !request.url.includes('/auth/refresh') &&
          !request.url.includes('/auth/login') &&
          this.authenticationService.refresh
        ) {
          return this.tokenRefresh().pipe(
            mergeMap(() => {
              request = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${this.authenticationService.access}`,
                },
              });
              return next.handle(request);
            })
          );
        }
        this.router.navigate(['/login'], { replaceUrl: true });
        return throwError(err);
      })
    );
  }

  private tokenRefresh(): Observable<void> {
    if (this.refreshTokenInProgress) {
      return this.tokenRefreshed$.asObservable();
    }
    this.refreshTokenInProgress = true;
    return this.authenticationService.tokenRefresh().pipe(
      tap(() => {
        this.refreshTokenInProgress = false;
        this.tokenRefreshed$.next();
      }),
      catchError((err) => {
        this.refreshTokenInProgress = false;
        this.tokenRefreshed$.next();
        this.authenticationService.logout();
        return throwError(err);
      })
    );
  }
}
