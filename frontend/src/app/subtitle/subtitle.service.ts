import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { IpadicFeatures } from 'kuromoji';
import { defer, Observable, of } from 'rxjs';
import { first, map, mergeMap } from 'rxjs/operators';
import { TokenizeService } from '../services/tokenizer.service';
import { DictionaryService } from './dictionary/dictionary.service';

interface SoundText {
  text: string;
  inputUnknownIndexes: { word: string; start: number; end: number }[];
  outputUnknownIndexes: { word: string; start: number; end: number }[];
  outputWarningIndexes: { start: number; end: number }[];
}

@Injectable({
  providedIn: 'root',
})
export class SubtitleService {
  private renderer: Renderer2;

  constructor(
    private tokenizeService: TokenizeService,
    private dictionaryService: DictionaryService,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

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
            const inputUnknownIndexes = [];
            const outputUnknownIndexes = [];
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
                inputUnknownIndexes.push({
                  word: token.surface_form,
                  start: inputIndex,
                  end: inputIndex + inputLength,
                });
                outputLength = token.surface_form.length;
                outputUnknownIndexes.push({
                  word: token.surface_form,
                  start: outputIndex,
                  end: outputIndex + outputLength,
                });
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

  splitByNewLine(text: string): Observable<string[]> {
    const maxWidth = 310;
    return this.tokenizeService.tokenize(text).pipe(
      map((features) => {
        const splittedTokens: string[] = [];
        let str = '';
        for (let i = 0; i < features.length; i++) {
          const feature = features[i];
          const nextFeature = features[i + 1];
          str += feature.surface_form;
          if (this.splittable(feature, nextFeature)) {
            str = str.replace(/。/g, '。\n').replace(/☆/g, '\n☆\n\n\n');
            if (str === '\n') {
              splittedTokens.push('');
            } else {
              splittedTokens.push(...str.split('\n'));
            }
            str = '';
          }
        }
        if (str) {
          splittedTokens.push(str);
        }

        const lines = [];
        const splitted = [];
        const canvas = this.renderer.createElement('canvas');
        const context = canvas.getContext('2d');

        let newLineCounter = 0;

        splittedTokens.forEach((token, i) => {
          if (!token) {
            if (newLineCounter < 1) {
              if (splitted.length > 0) {
                lines.push(splitted.join(''));
                splitted.length = 0;
              }
            } else if (newLineCounter < 2) {
              lines.push('');
            }
            newLineCounter++;
            return;
          }
          newLineCounter = 0;

          const metrics = context.measureText([...splitted, token].join(''));
          if (metrics.width > maxWidth) {
            if (splitted.length > 0) {
              lines.push(splitted.join(''));
              splitted.length = 0;
              splitted.push(token);
            } else {
              lines.push(token);
            }
            return;
          }

          if (['。', '！', '？', '-'].some((c) => token.endsWith(c))) {
            lines.push(splitted.join('') + token);
            splitted.length = 0;
            return;
          }

          splitted.push(token);
        });
        if (splitted.length > 0) {
          lines.push(splitted.join(''));
        }
        return lines;
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
    if (feature.surface_form === '\n') {
      return true;
    }

    const extractPos = (ipadicFeature: IpadicFeatures) =>
      [
        ipadicFeature.pos,
        ipadicFeature.pos_detail_1,
        ipadicFeature.pos_detail_2,
        ipadicFeature.pos_detail_3,
      ].filter((p) => p !== '*');

    const pos = extractPos(feature);
    const nextPos = nextFeature ? extractPos(nextFeature) : [];

    const splitPos = ['句点', '読点', '並立助詞', '係助詞', '連語', '接続助詞'];
    const nextUnsplittable = [...splitPos, '非自立', '助動詞'];

    const splitCharacters = ['。', '、', '？', '！'];

    const isNextSplit =
      nextFeature &&
      (splitCharacters.includes(nextFeature.surface_form) ||
        nextUnsplittable.some((p) => nextPos.includes(p)));

    const splittable =
      (splitPos.some((p) => pos.includes(p)) ||
        splitCharacters.includes(feature.surface_form)) &&
      !isNextSplit;

    return splittable;
  }
}
