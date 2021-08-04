import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
      .get<{ dictionary: UserDictionary }>('api/v1/dictionary')
      .pipe(
        map((response) => {
          this.userDictionary = JSON.parse(JSON.stringify(response.dictionary));
          return response.dictionary;
        })
      );
  }
  bulkUpdateUserDictionary(
    userDictionary: WordInformationParams[]
  ): Observable<UserDictionary> {
    return this.http
      .put<{ dictionary: UserDictionary }>('api/v1/dictionary', {
        dictionary: userDictionary,
      })
      .pipe(
        map((response) => {
          this.userDictionary = JSON.parse(JSON.stringify(response.dictionary));
          return response.dictionary;
        })
      );
  }
}
