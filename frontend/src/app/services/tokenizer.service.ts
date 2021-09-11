import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Token } from '../typing';

@Injectable({
  providedIn: 'root',
})
export class TokenizeService {
  constructor(private http: HttpClient) {}

  tokenize(text: string): Observable<Token[]> {
    return this.http.post<Token[]>('api/v2/tokenize', { text });
  }
}
