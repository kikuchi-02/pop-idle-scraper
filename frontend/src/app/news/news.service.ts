import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IdleKind, ScrapedResult, SiteName } from '../typing';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  constructor(private http: HttpClient) {}

  getTweets(idle: IdleKind): Observable<ScrapedResult> {
    return this.http.get<ScrapedResult>(`api/v1/twitter?kind=${idle}`);
  }

  getSite(site: SiteName): Observable<ScrapedResult> {
    return this.http.get<ScrapedResult>(`api/v1/site?kind=${site}`);
  }
}
