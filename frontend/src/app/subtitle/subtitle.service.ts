import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as wasm from 'wasm';

interface SoundText {
  text: string;
  input_unknown_indexes: { word: string; start: number; end: number }[];
  output_unknown_indexes: { word: string; start: number; end: number }[];
  output_warning_indexes: { start: number; end: number }[];
}

@Injectable({
  providedIn: 'root',
})
export class SubtitleService {
  constructor(private http: HttpClient) {}

  textToSoundText(text: string): Observable<SoundText> {
    return this.http.post<SoundText>('/api/v2/phonetics', { text });
  }

  splitByNewLine(
    text: string,
    maxWidth: number,
    font: string
  ): Observable<{
    lines: string[];
    input: any[];
    errors: string[];
    subtitle: string;
  }> {
    return this.http
      .post<string[]>('/api/v2/newline', { text })
      .pipe(
        map((splittedTokens) => {
          const wasmWidth = wasm.format_newline(splittedTokens, font, maxWidth);
          return wasmWidth;
        })
      );
  }

  extractTags(text: string): Observable<string[]> {
    return this.http
      .post<{ [key: string]: number }[]>('/api/v2/tags', { text })
      .pipe(map((tags) => Object.keys(tags)));
  }

  //
}
