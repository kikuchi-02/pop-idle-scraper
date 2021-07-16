import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IdleKind, Magazine, Member } from './../typing';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor(private http: HttpClient) {}

  getMemberTable(idle: IdleKind): Observable<object[][]> {
    return this.http.get<Member[]>(`api/v1/member-table?kind=${idle}`).pipe(
      catchError((err) => {
        console.error(err);
        return of(undefined);
      })
    );
  }

  getMagazines(date: string): Observable<Magazine[][]> {
    return this.http.get<Magazine[][]>(`api/v1/magazines?date=${date}`).pipe(
      catchError((err) => {
        console.error(err);
        return of(undefined);
      })
    );
  }
}
