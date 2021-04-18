import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IdleKind, ScrapedResult } from '../typing';

@Injectable({
  providedIn: 'root',
})
export class TwitterService {
  constructor(private http: HttpClient) {}

  getTweets(idle: IdleKind): Observable<ScrapedResult> {
    return this.http.get<ScrapedResult>(`api/twitter?kind=${idle}`).pipe(
      catchError((err) => {
        console.error(err);
        return of(undefined);
      })
    );
  }
}
