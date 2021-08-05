import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import Quill from 'quill';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { CrdtTextService } from '../services/crdt-text.service';
import { SubtitleService } from './subtitle.service';

const layouts = ['left', 'right', 'both'] as const;
type Layout = typeof layouts[number];

@Component({
  selector: 'app-subtitle',
  templateUrl: './subtitle.component.html',
  styleUrls: ['./subtitle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CrdtTextService],
})
export class SubtitleComponent implements OnInit, OnDestroy {
  public static subtitleLocalStorageKey = 'subtitleLocalStorageKey';

  loading = true;

  layout: Layout = 'both';
  dictionaryOpen = false;

  warningMessenger$ = new Subject<void>();
  newDictionaryKeys: string[] = [];

  private unsubscriber$ = new Subject<void>();
  private warningUnsubscriber$ = new Subject<void>();
  private inputEditor: Quill;
  private outputEditor: Quill;

  constructor(
    private cd: ChangeDetectorRef,
    private subtitleService: SubtitleService,
    private ngZone: NgZone
  ) {}

  onEditorCreated(event: Quill, type: 'input' | 'output'): void {
    const text = this.getInput();
    if (type === 'input') {
      this.inputEditor = event;
      this.inputEditor.setText(text);
    } else if (type === 'output') {
      this.outputEditor = event;
    }
    if (!text) {
      this.loading = false;
      this.cd.markForCheck();
    } else {
      this.convertSound();
    }
  }

  getInput(): string {
    const input = localStorage.getItem(
      SubtitleComponent.subtitleLocalStorageKey
    );
    return input || '';
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscriber$.next();
  }

  generateSubtitle(): void {
    const input = this.inputEditor.getText();
    localStorage.setItem(SubtitleComponent.subtitleLocalStorageKey, input);
    const output = this.formatSubtitle(input);
    this.outputEditor.setText(output);
  }

  convertSound(): void {
    this.loading = true;
    const input = this.inputEditor.getText();
    localStorage.setItem(SubtitleComponent.subtitleLocalStorageKey, input);
    this.subtitleService
      .textToSoundText(input)
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((result) => {
        Object.values(result.inputUnknownIndexes).forEach(({ start, end }) => {
          this.inputEditor.formatText(
            start,
            end - start,
            'background-color',
            'orange'
          );
        });
        this.outputEditor.setText(result.text);
        const outputText = this.outputEditor.getText();
        Object.values(result.outputUnknownIndexes).forEach(({ start, end }) => {
          const uuid = uuidv4();
          const unknown = outputText.substring(start, end);
          this.outputEditor.formatText(start, end - start, 'warning', {
            uuid,
            unknown,
          });
        });
        result.outputWarningIndexes.forEach(({ start, end }) => {
          const uuid = uuidv4();
          const num = parseInt(outputText.substring(start, end), 10);
          this.outputEditor.formatText(start, end - start, 'warning', {
            uuid,
            num,
          });
        });
        this.loading = false;
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

  applyLayout(type: Layout): void {
    if (layouts.includes(type)) {
      this.layout = type;
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

  private formatSubtitle(input: string): string {
    input = input.replace(/[\(|（].*[\)|）]/g, '');
    input = input.replace(/\n{3,}/g, '\n\n');
    input = input.replace(/、/g, '、\n');
    input = input.replace(/。/g, '。\n');

    const border = '-'.repeat(20);
    input = input.replace(
      /\n(\d+_\d+)\n/g,
      (match, p) => `\n${border}${p}${border}\n`
    );
    input = input.replace(
      /\n(\d+)\n/g,
      (match, p) => `\n${border}${p}${border}\n`
    );
    return input;
  }
}
