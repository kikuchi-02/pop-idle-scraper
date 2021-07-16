import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IdleKind, MemberLinks } from '../typing';

interface BulkIdleLink {
  kind: IdleKind;
  value: MemberLinks[];
}

@Injectable({ providedIn: 'root' })
export class GoogleSearchService {
  constructor(private http: HttpClient) {}

  getLinks(idles: IdleKind[]): Observable<BulkIdleLink[]> {
    const query = idles.map((site) => `kind[]=${site}`).join('&');
    return this.http.get<BulkIdleLink[]>(`api/v1/member-links?${query}`);
  }
}
