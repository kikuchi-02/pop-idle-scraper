import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IdleKind, Magazine, Member, ScrapedResult, SiteName } from './typing';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor(private http: HttpClient) {}

  getTweets(idle: IdleKind): Observable<ScrapedResult> {
    return this.http.get<ScrapedResult>(`api/twitter?kind=${idle}`).pipe(
      catchError((err) => {
        console.error(err);
        return of(undefined);
      })
    );
  }

  getSite(site: SiteName): Observable<ScrapedResult> {
    return this.http.get<ScrapedResult>(`api/site?kind=${site}`).pipe(
      catchError((err) => {
        console.error(err);
        return of(undefined);
      })
    );
  }

  getMembers(idle: IdleKind): Observable<Member[]> {
    return this.http.get<Member[]>(`api/members?kind=${idle}`).pipe(
      catchError((err) => {
        console.error(err);
        return of(undefined);
      })
    );
  }

  getMemberTable(idle: IdleKind): Observable<string[]> {
    return this.http.get<Member[]>(`api/member-table?kind=${idle}`).pipe(
      catchError((err) => {
        console.error(err);
        return of(undefined);
      })
    );
  }

  getMagazines(): Observable<Magazine[][]> {
    return this.http.get<Magazine[][]>('api/magazines').pipe(
      catchError((err) => {
        console.error(err);
        return of(undefined);
      })
    );
  }
}
