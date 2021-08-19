import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Script } from 'src/app/typing';
import { v4 as uuidv4 } from 'uuid';
import { ConstituencyResult } from '../../typing';
import { TextlintResultWithUUid } from './text-editor/editor.service';

@Injectable({
  providedIn: 'root',
})
export class ScriptService {
  private loadingStateSubject$ = new BehaviorSubject(false);
  loadingState$ = this.loadingStateSubject$.asObservable();
  private loadingUuids: string[] = [];

  constructor(private http: HttpClient) {}

  loadingStateChange(uuid?: string): string {
    if (uuid) {
      const index = this.loadingUuids.indexOf(uuid);
      if (index > -1) {
        this.loadingUuids.splice(index, 1);
      }
    } else {
      uuid = uuidv4();
      this.loadingUuids.push(uuid);
    }
    if (this.loadingUuids.length > 0) {
      this.loadingStateSubject$.next(true);
    } else {
      this.loadingStateSubject$.next(false);
    }
    return uuid;
  }

  constituencyParse(textBlocks: string[]): Observable<ConstituencyResult[][]> {
    return this.http.post<ConstituencyResult[][]>('api/v2/constituency-parse', {
      textBlocks,
    });
  }

  textLint(text: string): Observable<TextlintResultWithUUid> {
    return this.http
      .post<TextlintResultWithUUid[]>('api/v1/textlint', { text })
      .pipe(map((val) => val[0]));
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
        // status: script.status,
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
