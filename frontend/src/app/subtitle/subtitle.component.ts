import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';

const layouts = ['left', 'right', 'both'] as const;
type Layout = typeof layouts[number];

@Component({
  selector: 'app-subtitle',
  templateUrl: './subtitle.component.html',
  styleUrls: ['./subtitle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubtitleComponent implements OnInit {
  inputArea = '';
  outputArea = '';

  layout: Layout = 'both';

  private subtitleLocalStorageKey = 'subtitleLocalStorageKey';

  constructor(private cd: ChangeDetectorRef) {
    const input = localStorage.getItem(this.subtitleLocalStorageKey);
    if (input) {
      this.inputArea = input;
      this.outputArea = this.formatSubtitle(input);
      this.cd.markForCheck();
    }
  }

  ngOnInit(): void {}

  generateSubtitle(): void {
    const input = this.inputArea;
    localStorage.setItem(this.subtitleLocalStorageKey, input);
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
