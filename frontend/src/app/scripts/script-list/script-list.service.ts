import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginationResponse, Script } from 'src/app/typing';

@Injectable({
  providedIn: 'root',
})
export class ScriptListService {
  constructor(private http: HttpClient) {}

  getScripts(
    pageIndex = 0,
    pageSize = 10
  ): Observable<PaginationResponse<Script>> {
    return this.http.get<PaginationResponse<Script>>(
      `api/v1/scripts?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
  }

  deleteScripts(ids: number[]): Observable<void> {
    const query = ids.map((id) => `id[]=${id}`).join('&');
    return this.http.delete<void>(`api/v1/scripts?${query}`);
  }
}
