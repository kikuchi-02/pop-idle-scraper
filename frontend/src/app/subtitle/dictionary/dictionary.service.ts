import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginationResponse, UserDictionary, WordDetail } from 'src/app/typing';

@Injectable({
  providedIn: 'root',
})
export class DictionaryService {
  constructor(private http: HttpClient) {}

  getUserDictionary(
    pageIndex = 0,
    pageSize = 10,
    search?: string
  ): Observable<PaginationResponse<WordDetail>> {
    let query = `pageIndex=${pageIndex}&pageSize=${pageSize}`;
    if (search) {
      query += `&search=${search}`;
    }
    return this.http.get<PaginationResponse<WordDetail>>(
      `api/v2/dictionary?${query}`
    );
  }
  // getUserDictionary(): Observable<UserDictionary> {
  //   return this.http
  //     .get<{ dictionary: UserDictionary }>('api/v2/dictionary')
  //     .pipe(
  //       map((response) => {
  //         this.userDictionary = JSON.parse(JSON.stringify(response.dictionary));
  //         return response.dictionary;
  //       })
  //     );
  // }

  bulkUpdateUserDictionary(
    newWords: UserDictionary,
    updateWords: UserDictionary,
    deleteIds: number[]
  ): Observable<UserDictionary> {
    return this.http.put<UserDictionary>('api/v2/dictionary', {
      newWords,
      updateWords,
      deleteIds,
    });
  }
}
