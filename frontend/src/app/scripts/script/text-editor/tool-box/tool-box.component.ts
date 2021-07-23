import { Color } from '@angular-material-components/color-picker';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { forkJoin, of, Subject } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { ScriptService } from '../../script.service';
import { EditorService } from '../editor.service';

@Component({
  selector: 'app-tool-box',
  templateUrl: './tool-box.component.html',
  styleUrls: ['./tool-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolBoxComponent implements OnInit, OnDestroy {
  highlightValue = new FormControl('');
  underlineValue = new FormControl('');
  keywordValues = new FormControl();
  keys = ['考える', '思う'];

  colorCtr = new FormControl();
  color: ThemePalette = 'primary';

  @Output() toggleSubtitleButton = new EventEmitter<void>();

  @Output() loadingStateChange = new EventEmitter<boolean>();

  private toolBoxHighlightKey = 'tool-box-highlight-key';
  private toolBoxUnderlineKey = 'tool-box-underline-key';
  private toolBoxColorCodeKey = 'tool-box-color-code-key';

  private unsubscriber$ = new Subject<void>();

  constructor(
    private scriptService: ScriptService,
    private editorService: EditorService
  ) {
    const highlightValue = localStorage.getItem(this.toolBoxHighlightKey);
    if (highlightValue) {
      this.highlightValue.setValue(highlightValue);
    }
    const underlineValue = localStorage.getItem(this.toolBoxUnderlineKey);
    if (underlineValue) {
      this.underlineValue.setValue(underlineValue);
    }

    const colorHex = localStorage.getItem(this.toolBoxColorCodeKey);
    const colorCode = colorHex ? `#${colorHex}` : `#000000`;
    const colorGba = this.hex2rgb(colorCode);
    this.colorCtr.setValue(new Color(colorGba[0], colorGba[1], colorGba[2]));

    this.colorCtr.valueChanges
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((value) => {
        const newColorHex = `#${value.toHex()}`;
        this.editorService.onChangeColor(newColorHex);
        localStorage.setItem(this.toolBoxColorCodeKey, colorHex);
      });
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.unsubscriber$.next();
  }

  highlight(word: string): void {
    if (!word) {
      return;
    }
    localStorage.setItem(this.toolBoxHighlightKey, word);
    this.editorService.highlight(word);
  }

  removeOldHighlighted(): void {
    this.editorService.removeHighlight();
  }

  underlineSentenceByWord(word: string): void {
    if (!word) {
      return;
    }

    this.loadingStateChange.emit(true);

    this.scriptService
      .tokenize(word)
      .pipe(
        map((tokens) => {
          const baseFormWord = tokens[0].basic_form;
          if (baseFormWord === '*') {
            alert(`「${word}」の表層系が見つかりません。`);
            return undefined;
          }
          localStorage.setItem(this.toolBoxUnderlineKey, baseFormWord);
          return [baseFormWord];
        }),
        catchError((e) => of([])),
        takeUntil(this.unsubscriber$)
      )
      .subscribe((baseForms) => {
        if (baseForms) {
          this.editorService.underline(baseForms);
        }
        this.loadingStateChange.emit(false);
      });
  }

  bulkUnderline(): void {
    const words = this.keywordValues.value;

    this.loadingStateChange.emit(true);

    forkJoin(words.map((word: string) => this.scriptService.tokenize(word)))
      .pipe(
        map((tokensArray) => {
          const baseForms: string[] = tokensArray
            .map((tokens) => tokens[0].basic_form)
            .filter((baseForm) => baseForm !== '*');
          return baseForms;
        }),
        catchError((e) => of([])),
        takeUntil(this.unsubscriber$)
      )
      .subscribe((baseForms: string[]) => {
        if (baseForms.length > 0) {
          this.editorService.underline(baseForms);
        }
        this.loadingStateChange.emit(false);
      });
  }

  removeAllUnderlinedSentences(): void {
    this.editorService.removeUnderline();
  }

  removeStrike(): void {
    this.editorService.removeStrikes();
  }

  reformat(): void {
    this.editorService.reformat();
  }

  textLint(): void {
    const text = this.editorService.getText();
    if (!text) {
      return;
    }
    this.loadingStateChange.emit(true);
    this.scriptService
      .textLint(text)
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe(
        () => {
          this.loadingStateChange.emit(false);
        },
        (err) => this.loadingStateChange.emit(false)
      );
  }

  private hex2rgb(hex: string): number[] {
    if (hex.slice(0, 1) === '#') {
      hex = hex.slice(1);
    }
    if (hex.length === 3) {
      hex =
        hex.slice(0, 1) +
        hex.slice(0, 1) +
        hex.slice(1, 2) +
        hex.slice(1, 2) +
        hex.slice(2, 3) +
        hex.slice(2, 3);
    }

    return [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map((str) =>
      parseInt(str, 16)
    );
  }
}
