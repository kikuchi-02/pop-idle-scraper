import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IdleKind, ScrapedResult, SiteName } from '../typing';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  constructor(private http: HttpClient) {}

  getTweets(idle: IdleKind): Observable<ScrapedResult> {
    return this.http.get<ScrapedResult>(`api/v1/twitter?kind=${idle}`).pipe(
      catchError((e) => {
        console.error(e);
        return of(undefined);
      })
    );
  }

  getSite(site: SiteName): Observable<ScrapedResult> {
    return this.http.get<ScrapedResult>(`api/v1/site?kind=${site}`).pipe(
      catchError((e) => {
        console.error(e);
        return of(undefined);
      })
    );
  }
}
