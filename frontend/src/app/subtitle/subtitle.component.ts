import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import Quill from 'quill';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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

  private unsubscriber$ = new Subject<void>();
  private inputEditor: Quill;
  private outputEditor: Quill;

  constructor(
    private cd: ChangeDetectorRef,
    private subtitleService: SubtitleService
  ) {
    // TODO get user dictionary

    this.loading = false;
    this.cd.markForCheck();
  }

  onEditorCreated(event: Quill, type: 'input' | 'output'): void {
    if (type === 'input') {
      this.inputEditor = event;
      this.inputEditor.setText(this.getInput());
    } else if (type === 'output') {
      this.outputEditor = event;
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
    // TODO use quill for highlight
    this.loading = true;
    const input = this.inputEditor.getText();
    localStorage.setItem(SubtitleComponent.subtitleLocalStorageKey, input);
    this.subtitleService
      .textToSoundText(input)
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((result) => {
        Object.values(result.inputUnkownIndexes).forEach(({ start, end }) => {
          this.inputEditor.formatText(
            start,
            end - start,
            'background-color',
            'orange'
          );
        });
        this.outputEditor.setText(result.text);
        Object.values(result.outputUnkownIndexes).forEach(({ start, end }) => {
          this.outputEditor.formatText(
            start,
            end - start,
            'background-color',
            'orange'
          );
        });
        this.loading = false;
        this.cd.markForCheck();
      });
  }

  applyLayout(type: Layout): void {
    if (layouts.includes(type)) {
      this.layout = type;
      this.cd.markForCheck();
    }
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
