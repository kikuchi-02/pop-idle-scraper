import { Injectable } from '@angular/core';
import { IpadicFeatures } from 'kuromoji';
import { defer, Observable, of } from 'rxjs';
import { first, map, mergeMap } from 'rxjs/operators';
import { TokenizeService } from '../services/tokenizer.service';
import { DictionaryService } from './dictionary/dictionary.service';

interface SoundText {
  text: string;
  inputUnknownIndexes: { [key: string]: { start: number; end: number } };
  outputUnknownIndexes: { [key: string]: { start: number; end: number } };
  outputWarningIndexes: { start: number; end: number }[];
}

@Injectable({
  providedIn: 'root',
})
export class SubtitleService {
  constructor(
    private tokenizeService: TokenizeService,
    private dictionaryService: DictionaryService
  ) {}

  textToSoundText(text: string): Observable<SoundText> {
    text = text.replace(/（[^）]*）/g, '');

    return defer(() => {
      if (this.dictionaryService.userDictionary) {
        return of(this.dictionaryService.userDictionary);
      }
      return this.dictionaryService.getUserDictionary();
    }).pipe(
      first(),
      map((dictionary) => {
        const dictionaryMap = new Map<string, string>();
        dictionary.forEach((wordInfo) => {
          dictionaryMap.set(wordInfo.word, wordInfo.pronunciation);
        });
        return dictionaryMap;
      }),
      mergeMap((dictionaryMap) =>
        this.tokenizeService.tokenize(text).pipe(
          map((tokens) => {
            const inputUnknownIndexes = {};
            const outputUnknownIndexes = {};
            const outputWarningIndexes = [];
            const result = [];
            let inputIndex = 0;
            let outputIndex = 0;

            for (let index = 0; index < tokens.length; index++) {
              const token = tokens[index];

              let outputLength: number;
              const inputLength = token.surface_form.length;

              // should be ignored
              if (['☆'].includes(token.surface_form)) {
                inputIndex += token.surface_form.length;
                continue;
              }

              if (token.pos_detail_1 === '数') {
                outputWarningIndexes.push({
                  start: outputIndex,
                  end: outputIndex + token.surface_form.length,
                });
              }

              if (
                token.conjugated_type === '特殊・マス' &&
                tokens[index + 1]?.surface_form === '。'
              ) {
                const pronunciation = 'マ_ス';
                result.push(pronunciation);
                outputLength = pronunciation.length;
              } else if (dictionaryMap.has(token.surface_form.toLowerCase())) {
                const pronunciation = dictionaryMap.get(
                  token.surface_form.toLowerCase()
                );
                result.push(pronunciation);
                outputLength = pronunciation.length;
              } else if (
                token.word_type === 'KNOWN' &&
                token.pronunciation !== undefined
              ) {
                result.push(token.pronunciation);
                outputLength = token.pronunciation.length;
              } else {
                result.push(token.surface_form);
                inputUnknownIndexes[token.surface_form] = {
                  start: inputIndex,
                  end: inputIndex + inputLength,
                };
                outputLength = token.surface_form.length;
                outputUnknownIndexes[token.surface_form] = {
                  start: outputIndex,
                  end: outputIndex + outputLength,
                };
              }
              inputIndex += token.surface_form.length;
              outputIndex += outputLength;
            }
            return {
              text: result.join(''),
              inputUnknownIndexes,
              outputUnknownIndexes,
              outputWarningIndexes,
            };
          })
        )
      )
    );
  }

  splitByNewLine(text: string): Observable<string> {
    const maxLength = 31;
    return this.tokenizeService.tokenize(text).pipe(
      map((features) => {
        const splittedTokens: string[] = [];
        let str = '';
        for (let i = 0; i < features.length; i++) {
          const feature = features[i];
          const nextFeature = feature[i + 1];
          str += feature.surface_form;
          if (this.splittable(feature, nextFeature)) {
            splittedTokens.push(str);
            str = '';
          }
        }

        let result = '';
        let splitted = [];
        let counter = 0;
        splittedTokens.forEach((token, i) => {
          if (counter + token.length > maxLength) {
            result += splitted.join('');
            if (!token.startsWith('\n')) {
              result += '\n';
            }

            counter = 0;
            splitted = [];
          }
          if (['。', '！', '？', '-'].some((c) => token.endsWith(c))) {
            result += splitted.join('') + token;
            if (!(splittedTokens[i + 1] || '').startsWith('\n')) {
              result += '\n';
            }
            counter = 0;
            splitted = [];
          } else {
            splitted.push(token);
            counter += token.length;
          }
        });
        if (splitted.length > 0) {
          result += splitted.join('');
        }
        result = result.replace(/。\n/g, '。\n\n').replace(/\n{3,}/g, '\n\n');
        return result;
      })
    );
  }

  extractTags(text: string): Observable<string[]> {
    text = text.replace(/（[^）]*）/g, '').replace(/☆/g, '');
    return this.tokenizeService.tokenize(text).pipe(
      map((features) => {
        const counter = new Map<string, number>();
        features
          .filter(
            (feature) =>
              feature.word_type !== 'UNKNOWN' && feature.pos === '名詞'
          )
          .forEach((feature) => {
            const prev = counter.get(feature.basic_form) || 0;
            counter.set(feature.basic_form, prev + 1);
          });
        const tags = [];
        for (const [tag, count] of counter.entries()) {
          if (count > 2) {
            tags.push({ tag, count });
          }
        }
        const popularTags = tags
          .sort((a, b) => b.count - a.count)
          .slice(0, 30)
          .map((tag) => tag.tag);
        return popularTags;
      })
    );
  }

  private splittable(
    feature: IpadicFeatures,
    nextFeature?: IpadicFeatures
  ): boolean {
    // if (
    //   nextFeature !== undefined &&
    //   nextFeature.surface_form.startsWith('\n')
    // ) {
    //   return false;
    // }

    const extractPos = (ipadicFeature: IpadicFeatures) =>
      [
        ipadicFeature.pos,
        ipadicFeature.pos_detail_1,
        ipadicFeature.pos_detail_2,
        ipadicFeature.pos_detail_3,
      ].filter((p) => p !== '*');

    const pos = extractPos(feature);

    if (['句点', '読点', '係助詞', '並立助詞'].some((p) => pos.includes(p))) {
      return true;
    }
    if (['。', '、', '？', '！'].includes(feature.surface_form)) {
      return true;
    }

    const nextPos = nextFeature ? extractPos(feature) : [];
    if (
      pos.includes('接続助詞') &&
      ['句点', '読点', '非自立', '記号'].every((p) => !nextPos.includes(p))
    ) {
      return true;
    }

    return false;
  }
}
