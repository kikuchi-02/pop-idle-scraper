import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MemberLinks, IdleKind } from '../typing';

@Injectable({ providedIn: 'root' })
export class GoogleSearchService {
  constructor(private http: HttpClient) {}

  getLinks(idle: IdleKind): Observable<MemberLinks[]> {
    // return this.http.get<MemberLinks[]>(`api/v1/member-links?kind=${idle}`);
    return this.http
      .get<MemberLinks[]>(`api/v1/protected`)
      .pipe(map((l) => []));
  }
}
