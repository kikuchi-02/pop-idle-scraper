import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { first, map } from 'rxjs/operators';

declare const kuromoji;

// add this on angular.json scripts
// "./node_modules/kuromoji/build/kuromoji.js",

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
export class TokenizerService {
  private tokenizer$ = new ReplaySubject<any>(1);

  constructor() {
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
}
