import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserDictionary } from 'src/app/typing';

export interface WordInformationParams {
  id?: number;
  word: string;
  pronunciation: string;
  change?: 'create' | 'update' | 'delete';
}

@Injectable({
  providedIn: 'root',
})
export class DictionaryService {
  userDictionary: UserDictionary;

  constructor(private http: HttpClient) {}

  getUserDictionary(): Observable<UserDictionary> {
    return this.http
      .get<{ dictionary: UserDictionary }>('api/v2/dictionary')
      .pipe(
        map((response) => {
          this.userDictionary = JSON.parse(JSON.stringify(response.dictionary));
          return response.dictionary;
        })
      );
  }

  bulkUpdateUserDictionary(
    currentDictionary: WordInformationParams[]
  ): Observable<UserDictionary> {
    const oldUserDictionary = this.userDictionary;

    const oldDictionaryMap = new Map<number, WordInformationParams>();
    oldUserDictionary.forEach((wordInfo) => {
      oldDictionaryMap.set(wordInfo.id, wordInfo);
    });

    const currentDictionaryIds = new Set();
    currentDictionary = currentDictionary.map((wordInfo) => {
      if (wordInfo.id) {
        currentDictionaryIds.add(wordInfo.id);
      }
      wordInfo.word = wordInfo.word.trim().toLowerCase();
      wordInfo.pronunciation = wordInfo.pronunciation.trim().toLowerCase();
      return wordInfo;
    });

    const requestData: WordInformationParams[] = currentDictionary
      .filter((wordInfo) => wordInfo.word && wordInfo.pronunciation)
      .map((wordInfo: WordInformationParams) => {
        if (!wordInfo.id) {
          wordInfo.change = 'create';
          return wordInfo;
        }
        const old = oldDictionaryMap.get(wordInfo.id);
        if (
          wordInfo.word !== old.word ||
          wordInfo.pronunciation !== old.pronunciation
        ) {
          wordInfo.change = 'update';
          return wordInfo;
        }
        return wordInfo;
      })
      .filter((word) => word.change);

    oldUserDictionary.forEach((wordInfo) => {
      if (!currentDictionaryIds.has(wordInfo.id)) {
        (wordInfo as WordInformationParams).change = 'delete';
        requestData.push(wordInfo);
      }
    });

    if (requestData.length === 0) {
      return EMPTY;
    }

    return this.http
      .put<{ dictionary: UserDictionary }>('api/v2/dictionary', {
        dictionary: requestData,
      })
      .pipe(
        map((response) => {
          this.userDictionary = JSON.parse(JSON.stringify(response.dictionary));
          return response.dictionary;
        })
      );
  }
}
