import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EditorService {
  constructor(private http: HttpClient) {}

  tokenize(text: string): Observable<string[]> {
    // return this.http.get<string[]>('api/v2/users/me');
    return this.http.get<string[]>('api/v2/');
  }
}
