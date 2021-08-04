import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IpadicFeatures } from 'kuromoji';
import { BehaviorSubject, defer, Observable, of } from 'rxjs';
import { first, map } from 'rxjs/operators';

declare const kuromoji;

@Injectable({
  providedIn: 'root',
})
export class TokenizeService {
  private kuromojiTokenizer$ = new BehaviorSubject<any>(undefined);

  constructor(private http: HttpClient) {}

  tokenize(text: string): Observable<IpadicFeatures[]> {
    return this.http.post<IpadicFeatures[]>(`api/v1/tokenize`, { text });
  }

  /**
   *
   * @param text
   * @returns
   *   word_id: number; // 509800; // 辞書内での単語ID
   *   word_type: string; // 'KNOWN'; // 単語タイプ(辞書に登録されている単語ならKNOWN, 未知語ならUNKNOWN)
   *   word_position: number; // 1; // 単語の開始位置
   *   surface_form: string; // '黒文字'; // 表層形
   *   pos: string; // '名詞'; // 品詞
   *   pos_detail_1: string; // '一般'; // 品詞細分類1
   *   pos_detail_2: string; // '*'; // 品詞細分類2
   *   pos_detail_3: string; // '*'; // 品詞細分類3
   *   conjugated_type: string; // '*'; // 活用型
   *   conjugated_form: string; // '*'; // 活用形
   *   basic_form: string; // '黒文字'; // 基本形
   *   reading: string; // 'クロモジ'; // 読み
   *   pronunciation: string; // 'クロモジ'; // 発音
   *
   *   add this on angular.json scripts
   *   "./node_modules/kuromoji/build/kuromoji.js",
   */
  kuromojiTokenize(text: string): Observable<IpadicFeatures[]> {
    return defer(() => {
      const kuromojiTokenizer = this.kuromojiTokenizer$.getValue();
      if (kuromojiTokenizer) {
        return of(kuromojiTokenizer);
      }
      return new Observable((subscriber) => {
        // add this on angular.json assets
        // {
        //   "glob": "**/*",
        //   "input": "./node_modules/kuromoji/dict/",
        //   "output": "./assets/kuromoji/dict/"
        // }
        kuromoji
          .builder({ dicPath: '../../assets/kuromoji/dict' })
          .build((err, tokenizer) => {
            if (err) {
              console.error(err);
              subscriber.error(err);
            } else {
              this.kuromojiTokenizer$.next(tokenizer);
              subscriber.next(tokenizer);
            }
          });
      });
    }).pipe(
      first(),
      map((tokenizer) => {
        return tokenizer.tokenize(text);
      })
    );
  }
}
