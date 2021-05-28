import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IdleKind, Magazine, Member } from './typing';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor(private http: HttpClient) {}


  getMemberTable(idle: IdleKind): Observable<string[]> {
    return this.http.get<Member[]>(`api/member-table?kind=${idle}`).pipe(
      catchError((err) => {
        console.error(err);
        return of(undefined);
      })
    );
  }

  getMagazines(): Observable<Magazine[][]> {
    return this.http.get<Magazine[][]>('api/magazines').pipe(
      catchError((err) => {
        console.error(err);
        return of(undefined);
      })
    );
  }
}
