import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

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

  constructor(private http: HttpClient, private router: Router) {}

  login(
    email: string,
    password: string
  ): Observable<{ access: string; refresh: string }> {
    return this.http
      .post<{ access: string; refresh: string }>('/api/auth/login', {
        email,
        password,
      })
      .pipe(
        tap(({ access, refresh }: { access: string; refresh: string }) => {
          this.access = access;
          this.refresh = refresh;
          if (this.redirectUrl) {
            this.router.navigate([this.redirectUrl]);
            this.redirectUrl = null;
          }
        })
      );
  }

  tokenRefresh(): Observable<{ access: string; refresh: string }> {
    if (!this.refresh) {
      return throwError({ error: true, message: 'no refresh token' });
    }

    return this.http
      .post<{ access: string }>('/api/auth/refresh', {
        refresh: this.refresh,
      })
      .pipe(
        tap(({ access, refresh }: { access: string; refresh: string }) => {
          this.access = access;
          this.refresh = refresh;
        })
      );
  }

  logout(): void {
    this.access = undefined;
    this.refresh = undefined;
  }
}
