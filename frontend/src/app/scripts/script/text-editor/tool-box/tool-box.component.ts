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
import { catchError, filter, map, mergeMap, takeUntil } from 'rxjs/operators';
import { TokenizeService } from 'src/app/services/tokenizer.service';
import { ScriptService } from '../../script.service';
import { CONJUNCTIONS } from '../constants';
import { EditorService } from '../editor.service';

@Component({
  selector: 'app-tool-box',
  templateUrl: './tool-box.component.html',
  styleUrls: ['./tool-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolBoxComponent implements OnInit, OnDestroy {
  highlightValue = new FormControl('');
  baseFormValue = new FormControl('');
  keys = ['考える', '思う'];
  keywordValues = new FormControl(this.keys);

  conjunctions = CONJUNCTIONS;
  conjunctionValues = new FormControl(this.conjunctions);

  textColorCtr = new FormControl();
  backgroundColorCtr = new FormControl();
  color: ThemePalette = 'primary';

  @Output() toggleSubtitleButton = new EventEmitter<void>();

  private toolBoxHighlightKey = 'tool-box-highlight-key';
  private toolBoxBaseFormKey = 'tool-box-base-form-key';
  private toolBoxTextColorCodeKey = 'tool-box-text-color-code-key';
  private toolBoxBackgroundColorCodeKey = 'tool-box-background-color-code-key';

  private unsubscriber$ = new Subject<void>();

  constructor(
    private scriptService: ScriptService,
    private editorService: EditorService,
    private tokenizeService: TokenizeService
  ) {
    const highlightValue = localStorage.getItem(this.toolBoxHighlightKey);
    if (highlightValue) {
      this.highlightValue.setValue(highlightValue);
    }
    const baseFormValue = localStorage.getItem(this.toolBoxBaseFormKey);
    if (baseFormValue) {
      this.baseFormValue.setValue(baseFormValue);
    }

    this.textColorCtr.valueChanges
      .pipe(
        filter((v) => v),
        takeUntil(this.unsubscriber$)
      )
      .subscribe((value) => {
        const newColorHex = `#${value.toHex()}`;
        this.editorService.onChangeTextColor(newColorHex);
        localStorage.setItem(this.toolBoxTextColorCodeKey, newColorHex);
      });

    this.backgroundColorCtr.valueChanges
      .pipe(
        filter((v) => v),
        takeUntil(this.unsubscriber$)
      )
      .subscribe((value) => {
        const newColorHex = `#${value.toHex()}`;
        this.editorService.onChangeBackgroundColor(newColorHex);
        localStorage.setItem(this.toolBoxBackgroundColorCodeKey, newColorHex);
      });

    const textColorHex = localStorage.getItem(this.toolBoxTextColorCodeKey);
    const textColorCode = textColorHex ? `${textColorHex}` : `#000000`;
    const textColorGba = this.hex2rgb(textColorCode);
    this.textColorCtr.setValue(
      new Color(textColorGba[0], textColorGba[1], textColorGba[2])
    );

    const backgroundColorHex = localStorage.getItem(
      this.toolBoxBackgroundColorCodeKey
    );
    const backgroundColorCode = backgroundColorHex
      ? `${backgroundColorHex}`
      : `#000000`;
    const backgroundColorGba = this.hex2rgb(backgroundColorCode);
    this.backgroundColorCtr.setValue(
      new Color(
        backgroundColorGba[0],
        backgroundColorGba[1],
        backgroundColorGba[2]
      )
    );
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.unsubscriber$.next();
  }

  highlight(words: string[], color?: string): void {
    const word = this.highlightValue.value;
    if (!word) {
      return;
    }
    this.editorService.highlight(words, color);
  }

  removeOldHighlighted(): void {
    this.editorService.removeHighlight();
  }

  highlightBaseForm(words: string[], color?: string): void {
    if (words.length === 0) {
      return;
    }
    const uuid = this.scriptService.loadingStateChange();

    forkJoin(words.map((word: string) => this.tokenizeService.tokenize(word)))
      .pipe(
        map((tokensArray) => {
          const baseForms: string[] = tokensArray.map(
            (tokens) => tokens[0].basic_form
          );
          const noBaseForms = baseForms.filter((baseForm) => baseForm === '*');
          if (noBaseForms.length > 0) {
            alert(`以下の語句の表層系が見つかりません。\n${noBaseForms.join}`);
          }
          return baseForms.filter((baseForm) => baseForm !== '*');
        }),
        mergeMap((baseForms) =>
          this.editorService.highlightByBaseForm(baseForms, color)
        ),
        takeUntil(this.unsubscriber$)
      )
      .subscribe(
        (baseForms) => {
          this.scriptService.loadingStateChange(uuid);
        },
        (error) => {
          this.scriptService.loadingStateChange(uuid);
        }
      );
  }

  bulkUnderline(words: string[]): void {
    if (words.length === 0) {
      return;
    }

    const uuid = this.scriptService.loadingStateChange();

    forkJoin(words.map((word: string) => this.tokenizeService.tokenize(word)))
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
        this.scriptService.loadingStateChange(uuid);
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
