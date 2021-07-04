import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  get token(): string {
    return localStorage.getItem('token');
  }
  set token(t: string) {
    localStorage.setItem('token', t);
  }
  get refreshToken(): string {
    return localStorage.getItem('refresh');
  }
  set refreshToken(t: string) {
    localStorage.setItem('refresh', t);
  }

  constructor(private http: HttpClient) {}

  login(
    email: string,
    password: string
  ): Observable<{ token: string; refreshToken: string }> {
    return this.http
      .post<{ token: string; refreshToken: string }>('/api/auth/login', {
        email,
        password,
      })
      .pipe(
        tap(
          ({
            token,
            refreshToken,
          }: {
            token: string;
            refreshToken: string;
          }) => {
            this.token = token;
            this.refreshToken = refreshToken;
          }
        )
      );
  }

  refresh(): Observable<{ token: string }> {
    if (!this.refreshToken) {
      return throwError({ error: true, message: 'no refresh token' });
    }

    return this.http
      .post<{ token: string }>('/api/auth/refresh', {
        refreshToken: this.refreshToken,
      })
      .pipe(
        tap(({ token }: { token: string }) => {
          this.token = token;
        })
      );
  }

  logout(): void {
    this.token = undefined;
    this.refreshToken = undefined;
  }
}
