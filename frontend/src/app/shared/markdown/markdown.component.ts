import 'brace';
import 'brace/mode/markdown';
import 'brace/theme/monokai';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { Subject } from 'rxjs';

@Component({
  selector: 'app-markdown',
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkdownComponent implements OnInit, OnDestroy {
  @Input() id: string;
  get localStorageKey(): string {
    return `markdown-${this.id}`;
  }

  value = '';

  options: any = {
    fontFamily:
      'Menlo, Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
    fontSize: '14px',
    wrap: true,
    showGutter: true,
    showInvisibles: true,
    showPrintMargin: false,
    displayIndentGuides: true,
    highlightGutterLine: true,
    scrollPastEnd: true,
  };

  private unsubscriber$ = new Subject<void>();

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    const saved = localStorage.getItem(this.localStorageKey);
    if (!!saved) {
      this.value = JSON.parse(saved);
    }
  }
  ngOnDestroy(): void {
    this.unsubscriber$.next();
  }

  onChange(event) {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.value));
  }
}
