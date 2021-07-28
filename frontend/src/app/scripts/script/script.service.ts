/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IpadicFeatures } from 'kuromoji';
import { Observable, ReplaySubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Script } from 'src/app/typing';
import { ConstituencyResult } from '../../typing';

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
export class ScriptService {
  private lintResultSubject$ = new ReplaySubject<TextLintMessages>(1);
  lintResult$ = this.lintResultSubject$.asObservable();

  constructor(private http: HttpClient) {}

  tokenize(text: string): Observable<IpadicFeatures[]> {
    return this.http.post<IpadicFeatures[]>(`api/v1/tokenize`, { text });
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

  getScript(id: number): Observable<Script> {
    return this.http
      .get<Partial<Script>>(`api/v1/scripts/${id}`)
      .pipe(map((script) => new Script(script)));
  }

  putScript(script: Script): Observable<Script> {
    return this.http
      .put<Partial<Script>>(`api/v1/scripts/${script.id}`, {
        title: script.title,
        deltaOps: script.deltaOps,
      })
      .pipe(map((newScript) => new Script(newScript)));
  }

  postScript(script: Script): Observable<Script> {
    return this.http
      .post<Partial<Script>>(`api/v1/scripts`, {
        title: script.title,
        deltaOps: script.deltaOps,
      })
      .pipe(map((newScript) => new Script(newScript)));
  }

  deleteScript(scriptId: number): Observable<void> {
    return this.http.delete<void>(`api/v1/scripts/${scriptId}`);
  }
}
