import { Injectable } from '@angular/core';
import { defer, Observable, of } from 'rxjs';
import { first, map, mergeMap } from 'rxjs/operators';
import { TokenizeService } from '../services/tokenizer.service';
import { DictionaryService } from './dictionary/dictionary.service';

interface SoundText {
  text: string;
  inputUnkownIndexes: { [key: string]: { start: number; end: number } };
  outputUnkownIndexes: { [key: string]: { start: number; end: number } };
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
            const inputUnkownIndexes = {};
            const outputUnkownIndexes = {};
            const result = [];
            let inputIndex = 0;
            let outputIndex = 0;

            for (const token of tokens) {
              let outputLength: number;
              const inputLength = token.surface_form.length;

              if (
                token.word_type === 'KNOWN' &&
                token.pronunciation !== undefined
              ) {
                result.push(token.pronunciation);
                outputLength = token.pronunciation.length;
              } else if (dictionaryMap.has(token.surface_form.toLowerCase())) {
                const pronunciation = dictionaryMap.get(
                  token.surface_form.toLowerCase()
                );
                result.push(pronunciation);
                outputLength = pronunciation.length;
              } else {
                result.push(token.surface_form);
                inputUnkownIndexes[token.surface_form] = {
                  start: inputIndex,
                  end: inputIndex + inputLength,
                };
                outputLength = token.surface_form.length;
                outputUnkownIndexes[token.surface_form] = {
                  start: outputIndex,
                  end: outputIndex + outputLength,
                };
              }
              inputIndex += token.surface_form.length;
              outputIndex += outputLength;
            }
            return {
              text: result.join(''),
              inputUnkownIndexes,
              outputUnkownIndexes,
            };
          })
        )
      )
    );
  }

  // private;
}
