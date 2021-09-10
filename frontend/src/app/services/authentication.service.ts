import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { User } from '../typing';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  get access(): string {
    return localStorage.getItem('access');
  }
  set access(t: string) {
    localStorage.setItem('access', t);
  }
  get refresh(): string {
    return localStorage.getItem('refresh');
  }
  set refresh(t: string) {
    localStorage.setItem('refresh', t);
  }

  public redirectUrl: string;
  public user: User;

  constructor(
    private http: HttpClient,
    private router: Router,
    private appService: AppService
  ) {}

  login(email: string, password: string): Observable<void> {
    return this.http
      .post<{ access: string; refresh: string; user: User }>(
        '/api/auth/login',
        {
          email,
          password,
        }
      )
      .pipe(
        mergeMap(
          ({
            access,
            refresh,
            user,
          }: {
            access: string;
            refresh: string;
            user: User;
          }) => {
            this.access = access;
            this.refresh = refresh;
            this.user = user;
            return of(void 0);
          }
        ),
        tap(() => {
          this.appService.reconnect();
          if (this.redirectUrl) {
            this.router.navigate([this.redirectUrl]);
            this.redirectUrl = null;
          } else {
            this.router.navigate(['/']);
          }
        })
      );
  }

  tokenRefresh(): Observable<void> {
    if (!this.refresh) {
      return throwError({ error: true, message: 'no refresh token' });
    }

    return this.http
      .post<{ access: string; refresh: string; user: User }>(
        '/api/auth/refresh',
        {
          refresh: this.refresh,
        }
      )
      .pipe(
        mergeMap(
          ({
            access,
            refresh,
            user,
          }: {
            access: string;
            refresh: string;
            user: User;
          }) => {
            this.access = access;
            this.refresh = refresh;
            this.user = user;

            return of(void 0);
          }
        )
      );
  }

  logout(): void {
    this.access = undefined;
    this.refresh = undefined;
  }
}
