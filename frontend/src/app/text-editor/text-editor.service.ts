/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { Observable, ReplaySubject } from 'rxjs';

import { ConstituencyResult } from '../typing';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, map, tap } from 'rxjs/operators';

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

export interface KuromojiToken {
  word_id: number; // 509800; // 辞書内での単語ID
  word_type: string; // 'KNOWN'; // 単語タイプ(辞書に登録されている単語ならKNOWN, 未知語ならUNKNOWN)
  word_position: number; // 1; // 単語の開始位置
  surface_form: string; // '黒文字'; // 表層形
  pos: string; // '名詞'; // 品詞
  pos_detail_1: string; // '一般'; // 品詞細分類1
  pos_detail_2: string; // '*'; // 品詞細分類2
  pos_detail_3: string; // '*'; // 品詞細分類3
  conjugated_type: string; // '*'; // 活用型
  conjugated_form: string; // '*'; // 活用形
  basic_form: string; // '黒文字'; // 基本形
  reading: string; // 'クロモジ'; // 読み
  pronunciation: string; // 'クロモジ'; // 発音
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

  tokenize(text: string): Observable<KuromojiToken[]> {
    return this.tokenizer$.pipe(
      first(),
      map((tokenizer): KuromojiToken[] => tokenizer.tokenize(text))
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

  splitTextByNewline(content: string): string {
    if (content.length < 2) {
      return content;
    }

    const patterns = [
      /「[^」]*」/g,
      /（[^）]*）/g,
      /\([^\)]*\)/g,
      /\[[^\]]*\]/g,
      /"[^"]*"/g,
      /”[^”]*”/g,
    ];
    let masked = content;
    patterns.forEach((pattern) => {
      masked = masked.replace(pattern, (match) => '#'.repeat(match.length));
    });

    let result = '';
    let start = 0;
    [...Array(masked.length - 1)].forEach((_, i) => {
      if (masked.charAt(i) === '。') {
        result += content.substring(start, i + 1) + '\n';
        start = i + 1;
      }
    });
    result += content.substring(start);

    return result;
  }
}
