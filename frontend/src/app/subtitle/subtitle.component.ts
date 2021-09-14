import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { QuillEditorComponent } from 'ngx-quill';
import Quill from 'quill';
import { BehaviorSubject, Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import * as wasm from 'wasm';
import { AppService } from '../services/app.service';
import { availableFonts, Font } from '../typing';
import { SubtitleService } from './subtitle.service';

// eslint-disable-next-line @typescript-eslint/naming-convention
const Delta = Quill.import('delta');

interface Srt {
  duration: number;
  text: string;
}

const targets = ['plain', 'sound', 'tag', 'srt', 'link'] as const;
type Target = typeof targets[number];

@Component({
  selector: 'app-subtitle',
  templateUrl: './subtitle.component.html',
  styleUrls: ['./subtitle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubtitleComponent implements OnInit, OnDestroy {
  public static subtitleLocalStorageKey = 'subtitleLocalStorageKey';
  static subtitleTargetLocalStorageKey = 'subtitleTargetLocalStorageKey';

  loading = false;

  target: Target = undefined;
  targets = targets;
  dictionaryOpen = false;

  warningMessenger$ = new Subject<void>();
  newDictionaryKeys: string[] = [];

  get subtitleWidth(): number {
    return this.appService.subtitleWidth;
  }
  set subtitleWidth(v: number) {
    this.appService.subtitleWidth = v;
  }

  get subtitleLineLeftPx(): number {
    return (this.subtitleWidth / 100) * 310 * 2 + 15;
  }

  @ViewChild(QuillEditorComponent) quillEditor: QuillEditorComponent;

  get showSubtitleLine(): boolean {
    if (!this.quillEditor) {
      return false;
    }
    const editorWidth = this.quillEditor.elementRef.nativeElement.getBoundingClientRect()
      .width;
    return this.subtitleLineLeftPx + 15 < editorWidth;
  }

  darkTheme = false;

  fonts = availableFonts;
  get font(): Font {
    return this.appService.font;
  }
  set font(v: Font) {
    this.appService.font = v;
  }

  get editorWidth(): number {
    if (this.quillEditor) {
      return this.quillEditor.elementRef.nativeElement.getBoundingClientRect()
        .width;
    }
    return 0;
  }

  private errors = new Map<Target, boolean>(
    targets.map((target) => [target, false])
  );

  get hasError(): boolean {
    return this.errors.get(this.target);
  }

  private editorInitialized$ = new BehaviorSubject<boolean>(false);

  private unsubscriber$ = new Subject<void>();
  private warningUnsubscriber$ = new Subject<void>();
  private inputEditor: Quill;
  private outputEditor: Quill;

  constructor(
    private appService: AppService,
    private cd: ChangeDetectorRef,
    private subtitleService: SubtitleService,
    private ngZone: NgZone,
    private renderer: Renderer2
  ) {
    this.appService.darkTheme$
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((val) => {
        this.darkTheme = val;
        this.cd.markForCheck();
      });
  }

  onEditorCreated(event: Quill, type: 'input' | 'output'): void {
    if (type === 'input') {
      this.inputEditor = event;
      if (!this.outputEditor) {
        return;
      }
    } else if (type === 'output') {
      this.outputEditor = event;
      if (!this.inputEditor) {
        return;
      }
    }

    this.initialInput();

    const target = localStorage.getItem(
      SubtitleComponent.subtitleTargetLocalStorageKey
    ) as Target;
    this.applyTarget(target);

    this.editorInitialized$.next(true);
    this.cd.markForCheck();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscriber$.next();
  }

  convertSound(): void {
    const loadingKey = this.appService.setLoading();
    const input = this.inputEditor.getText().trim();
    this.subtitleService
      .textToSoundText(input)
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((result) => {
        this.errors.set('sound', result.input_unknown_indexes.length > 0);
        this.outputEditor.setContents([{ insert: '\n' }] as any);
        this.outputEditor.setText(result.text);
        const outputText = this.outputEditor.getText();
        const res = wasm.format_sound(input, outputText, result);
        this.inputEditor.setContents(res.input);
        this.outputEditor.setContents(res.output);

        const outputDelta2 = new Delta();
        let lastOutputIndex2 = 0;
        result.output_warning_indexes.forEach(({ start, end }) => {
          const uuid = uuidv4();
          const num = parseInt(outputText.substring(start, end), 10);
          outputDelta2.retain(start - lastOutputIndex2);
          outputDelta2.retain(end - start, { warning: { uuid, num } });
          lastOutputIndex2 = end;
        });
        this.outputEditor.updateContents(outputDelta2);

        this.appService.resolveLoading(loadingKey);
        this.cd.markForCheck();

        this.ngZone.onStable
          .pipe(
            first(),
            takeUntil(this.warningUnsubscriber$),
            takeUntil(this.unsubscriber$)
          )
          .subscribe(() => {
            this.warningMessenger$.next();
          });
      });
  }

  extractTags(): void {
    const uuid = this.appService.setLoading();
    const input = this.inputEditor.getText();
    this.subtitleService
      .extractTags(input)
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((tags) => {
        const text = tags.map((tag) => `#${tag}`).join(' ');
        this.outputEditor.setText(text);
        this.appService.resolveLoading(uuid);
        this.cd.markForCheck();
      });
  }

  applyTarget(type: Target): void {
    if (targets.includes(type)) {
      this.target = type;
      localStorage.setItem(
        SubtitleComponent.subtitleTargetLocalStorageKey,
        type
      );
      this.refreshInput();
      this.refreshOutput();
      this.cd.markForCheck();
    }
  }

  warningChange(event: { uuid: string; num?: string; unknown?: string }): void {
    if (event.num) {
      const delta = this.outputEditor.getContents();
      delta.ops = delta.ops.map((op) => {
        if (op.attributes?.warning?.uuid !== event.uuid) {
          return op;
        }
        op.insert = event.num;
        return op;
      });
      this.outputEditor.setContents(delta);
      this.warningMessenger$.next();
    }
    if (event.unknown) {
      this.newDictionaryKeys = [event.unknown];
      this.dictionaryOpen = true;
    }
    this.cd.markForCheck();
  }

  download(): void {
    const content = this.outputEditor.getText();

    let filename: string;
    switch (this.target) {
      case 'srt':
        filename = `subtitle.srt`;
        break;
      default:
        filename = `${this.target}.txt`;
    }

    const anchor = this.renderer.createElement('a');
    this.renderer.setStyle(anchor, 'display', 'none');
    const blob = new Blob([content], { type: 'octet/stream' });
    const url = window.URL.createObjectURL(blob);
    this.renderer.setAttribute(anchor, 'href', url);
    this.renderer.setAttribute(anchor, 'download', filename);
    this.renderer.appendChild(document.body, anchor);

    anchor.click();
    window.URL.revokeObjectURL(url);
    this.renderer.removeChild(document.body, anchor);
  }

  subtitleToSrt(): void {
    const loadingKey = this.appService.setLoading();
    const input = this.inputEditor
      .getText()
      .trim()
      .replace(/（[^）]*）/g, '')
      .replace(/\d\.?\s?\n/g, '\n')
      .replace(/【(.*)】/g, (match, p1, offset, str) => p1 + '\n');
    const maxWidth = (this.subtitleWidth / 100) * 310 * 2;

    this.subtitleService
      .splitByNewLine(input, maxWidth, this.font)
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((response) => {
        this.inputEditor.setContents([{ insert: '\n' }] as any);
        this.outputEditor.setContents([{ insert: '\n' }] as any);

        this.inputEditor.setText(response.lines.join('\n'));

        this.inputEditor.updateContents(response.input as any);

        this.errors.set('srt', response.errors.length > 0);
        this.outputEditor.setText(response.subtitle);

        this.appService.resolveLoading(loadingKey);
        this.cd.markForCheck();
      });
  }

  extractLinks(): void {
    const str = this.inputEditor.getText().trim();
    const regexp = new RegExp(/(https?:\/\/[^\s|\)|\]]+)/, 'g');
    let match;

    const urlSet = new Set();

    while ((match = regexp.exec(str)) !== null) {
      urlSet.add(match[0]);
    }

    const result = '参考\n' + [...urlSet].sort().join('\n');

    this.outputEditor.setText(result);
  }

  initialInput(): void {
    const input = localStorage.getItem(
      SubtitleComponent.subtitleLocalStorageKey
    );

    if (input) {
      this.inputEditor.setText(input);
    } else {
      this.inputEditor.setText(
        'これはサンプルの文章です。\n' +
          'この工程では、"/subtitle"で文章を変換し、"softalk"に入力用の文章へ変換したり、字幕を生成します。\n' +
          'ターゲットが"sound"の時はoutput欄の色がついている文字をクリックすることで、ユーザー辞書への登録も可能です。\n\n' +
          'ターゲットが"srt"の時は字幕入力形式に変換します。\n\n' +
          'https://w.atwiki.jp/softalk/\n'
      );
    }
  }

  refreshInput(): void {
    const text = this.inputEditor.getText();
    this.inputEditor.setText(text);
  }

  saveInput(): void {
    const content = this.inputEditor.getText();
    localStorage.setItem(SubtitleComponent.subtitleLocalStorageKey, content);
  }

  refreshOutput(): void {
    switch (this.target) {
      case 'plain':
        this.outputEditor.setText(this.inputEditor.getText());
        break;
      case 'sound':
        this.convertSound();
        break;
      case 'tag':
        this.extractTags();
        break;
      case 'srt':
        this.subtitleToSrt();
        break;
      case 'link':
        this.extractLinks();
        break;
      default:
        throw new Error(`not implemented this type ${this.target}`);
    }
  }

  scrollToError(side: 'input' | 'output'): void {
    const scrollers = document.querySelectorAll('.ql-editor');
    const scroller = side === 'input' ? scrollers[0] : scrollers[1];

    const scrollTop = scroller.scrollTop;

    const cautionElements = [];
    cautionElements.push(
      ...Array.from(document.querySelectorAll('[data-caution]'))
    );
    cautionElements.push(
      ...Array.from(document.querySelectorAll('[data-warning-unknown]'))
    );

    let find = false;
    for (const element of cautionElements) {
      const top = (element as any).offsetTop - 200;
      if (top > scrollTop) {
        scroller.scrollTo({ top, behavior: 'smooth' });
        find = true;
        break;
      }
    }
    if (find) {
      return;
    }
    for (const element of cautionElements) {
      const top = Math.max((element as any).offsetTop - 200, 0);
      scroller.scrollTo({ top, behavior: 'smooth' });
      break;
    }
  }

  private calcSubtitleTime(
    seconds: number
  ): { hour: string; minute: string; second: string } {
    const hour = Math.floor(seconds / 3600);
    const minute = Math.floor((seconds - hour * 60) / 60);
    const second = Math.floor(seconds % 60);

    // plus one for davinci
    const hourS = ('00' + (hour + 1).toString()).slice(-2);
    const minuteS = ('00' + minute.toString()).slice(-2);
    const secondS = ('00' + second.toString()).slice(-2);
    return { hour: hourS, minute: minuteS, second: secondS };
  }

  private calcSrt(text1: string, text2?: string): Srt {
    const baseTime = 7.5;
    const maxLength = 30;

    let duration: number;
    let text: string;

    if (!text2) {
      if (text1 === '☆') {
        duration = 2;
      } else {
        duration = Math.ceil((text1.length / maxLength) * baseTime);
        duration = Math.max(duration, 2);
        duration = Math.min(duration, 15);
      }
      text = `<b>${text1}</b>`;
      return { duration, text };
    }
    duration = Math.ceil(
      ((text1.length + text2.length) / maxLength) * baseTime
    );
    text = `<b>${text1}</b>\n<b>${text2}</b>`;
    return { duration, text };
  }
}
