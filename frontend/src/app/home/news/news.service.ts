import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IdleKind, ScrapedResult, SiteName } from '../../typing';

interface BulkIdleResult {
  kind: IdleKind;
  value: ScrapedResult;
}
interface BulkSiteResult {
  kind: SiteName;
  value: ScrapedResult;
}

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  constructor(private http: HttpClient) {}

  getTweets(idles: IdleKind[]): Observable<BulkIdleResult[]> {
    const query = idles.map((site) => `kind[]=${site}`).join('&');
    return this.http.get<BulkIdleResult[]>(`api/v1/twitter?${query}`).pipe(
      catchError((e) => {
        console.error(e);
        return of(undefined);
      })
    );
  }

  getSite(sites: SiteName[]): Observable<BulkSiteResult[]> {
    const query = sites.map((site) => `kind[]=${site}`).join('&');
    return this.http.get<BulkSiteResult[]>(`api/v1/site?${query}`).pipe(
      catchError((e) => {
        console.error(e);
        return of(undefined);
      })
    );
  }
}
