import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Script } from 'src/app/typing';

@Injectable({
  providedIn: 'root',
})
export class ScriptListService {
  constructor(private http: HttpClient) {}

  getScripts(page: number): Observable<Script[]> {
    return this.http.get<Script[]>(`api/v1/scripts?page=${page}`);
  }

  deleteScripts(ids: number[]): Observable<void> {
    const query = ids.map((id) => `id[]=${id}`).join('&');
    return this.http.delete<void>(`api/v1/scripts?${query}`);
  }
}
