import { Observable, ReplaySubject } from 'rxjs';

import { ConstituencyResult } from '../typing';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';

declare const kuromoji;

export interface TextLintMessages {
  0: {
    filePath: '<text>';
    messages: {
      column: number;
      index: number;
      line: number;
      message: string;
      ruleId: string;
      severity: number;
      type: string;
    }[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class TextEditorService {
  private tokenizer$ = new ReplaySubject<any>(1);

  private lintResultSubject$ = new ReplaySubject<TextLintMessages>(1);
  lintResult$ = this.lintResultSubject$.asObservable();

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

  textLint(text: string): Observable<TextLintMessages> {
    return this.http
      .post<TextLintMessages>('api/v1/textlint', { text })
      .pipe(
        tap((result) => {
          this.lintResultSubject$.next(result);
        })
      );
  }
}
