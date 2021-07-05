import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IdleKind, MemberLinks } from '../typing';

@Injectable({ providedIn: 'root' })
export class GoogleSearchService {
  constructor(private http: HttpClient) {}

  getLinks(idle: IdleKind): Observable<MemberLinks[]> {
    return this.http.get<MemberLinks[]>(`api/v1/member-links?kind=${idle}`);
  }
}
