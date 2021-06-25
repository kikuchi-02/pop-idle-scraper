import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConstituencyResult } from '../typing';

declare const kuromoji;

@Injectable({
  providedIn: 'root',
})
export class EditorService {
  private tokenizer$ = new ReplaySubject<any>(1);

  constructor(private http: HttpClient) {
    kuromoji
      .builder({ dicPath: '../../assets/kuromoji/dict' })
      .build((err, tokenizer) => {
        if (err) {
          console.error(err);
        } else {
          this.tokenizer$.next(tokenizer);
        }
      });
  }

  tokenize(text: string): Observable<string> {
    return this.tokenizer$.pipe(
      map((tokenizer): string => tokenizer.tokenize(text))
    );
  }

  constituencyParse(textBlocks: string[]): Observable<ConstituencyResult[][]> {
    return this.http.post<ConstituencyResult[][]>('api/v2/constituency-parse', {
      textBlocks,
    });
  }
}
