import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IdleKind, Member } from '../typing';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  constructor(private http: HttpClient) {}

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
}
