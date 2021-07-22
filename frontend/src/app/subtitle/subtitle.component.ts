import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { CrdtTextService } from '../services/crdt-text.service';

const layouts = ['left', 'right', 'both'] as const;
type Layout = typeof layouts[number];

@Component({
  selector: 'app-subtitle',
  templateUrl: './subtitle.component.html',
  styleUrls: ['./subtitle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CrdtTextService],
})
export class SubtitleComponent implements OnInit, DoCheck, OnDestroy {
  public static subtitleLocalStorageKey = 'subtitleLocalStorageKey';

  inputArea = '';
  outputArea = '';

  layout: Layout = 'both';

  @ViewChild('subtitle_TextArea')
  private inputAreaElm: ElementRef;

  private unsubscriber$ = new Subject<void>();

  constructor(
    private cd: ChangeDetectorRef,
    private ngZone: NgZone,
    private crdtTextService: CrdtTextService
  ) {
    this.inputArea = this.getInput();

    const ytext = this.crdtTextService.createText('test', this.inputArea);
    this.inputArea = ytext || this.inputArea;
    this.cd.markForCheck();

    this.crdtTextService.registerObserver((txt, delta) => {
      if (txt === this.inputArea) {
        return;
      }
      const current = this.crdtTextService.applyDeltaToCurrent(delta, {
        txt: this.inputArea,
        selectionStart: this.inputAreaElm?.nativeElement?.selectionStart,
        selectionEnd: this.inputAreaElm?.nativeElement?.selectionEnd,
      });

      this.inputArea = current.txt;
      this.cd.markForCheck();

      if (
        current.selectionStart !== undefined &&
        current.selectionEnd !== undefined
      ) {
        this.ngZone.onStable
          .pipe(first(), takeUntil(this.unsubscriber$))
          .subscribe(() => {
            this.inputAreaElm.nativeElement.setSelectionRange(
              current.selectionStart,
              current.selectionEnd
            );
          });
      }
    });
  }

  getInput(): string {
    const input = localStorage.getItem(
      SubtitleComponent.subtitleLocalStorageKey
    );
    return input || '';
  }

  undo(): void {
    this.crdtTextService.undo();
  }
  redo(): void {
    this.crdtTextService.redo();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscriber$.next();
  }

  ngDoCheck(): void {
    this.crdtTextService.onTextChange(this.inputArea);
  }

  generateSubtitle(): void {
    const input = this.inputArea;
    localStorage.setItem(SubtitleComponent.subtitleLocalStorageKey, input);
    const output = this.formatSubtitle(input);
    this.outputArea = output;
    this.cd.markForCheck();
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
