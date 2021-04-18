import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ScrapedResult, SiteName } from '../typing';

@Injectable({
  providedIn: 'root',
})
export class SiteService {
  constructor(private http: HttpClient) {}

  getSite(site: SiteName): Observable<ScrapedResult> {
    return this.http.get<ScrapedResult>(`api/site?kind=${site}`).pipe(
      catchError((err) => {
        console.error(err);
        return of(undefined);
      })
    );
  }
}
