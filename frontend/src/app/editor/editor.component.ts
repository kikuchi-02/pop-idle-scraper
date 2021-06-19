import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import EditorJS, { API, BlockAPI } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Marker from '@editorjs/marker';
import { from, Subject } from 'rxjs';
import { auditTime, debounceTime, takeUntil } from 'rxjs/operators';
import { MarkerTool, MyInlineTool } from './tools';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent implements OnInit, OnDestroy {
  @ViewChild('editor') editor: ElementRef;

  initEditor = false;

  inner = '';

  highlightValue = new FormControl('');

  private outputDataKey = `editor-output`;

  editorJs = new EditorJS({
    autofocus: true,
    placeholder: 'Let`s write an awesome story!',
    tools: {
      header: {
        class: Header,
        shortcut: 'CMD+SHIFT+H',
      },
      marker: {
        class: MarkerTool,
        shortcut: 'CMD+SHIFT+M',
      },
      my: MyInlineTool,
    },
    data: JSON.parse(localStorage.getItem(this.outputDataKey)) || {},
    onReady: () => {
      this.initEditor = true;
      this.cd.markForCheck();
    },
    onChange: (api, blocks) => {
      this.editorSubject$.next([api, blocks]);
    },
  });

  private unsubscriber$ = new Subject<void>();
  private editorSubject$ = new Subject<[API, BlockAPI]>();

  constructor(private cd: ChangeDetectorRef) {
    this.editorSubject$
      .pipe(auditTime(1000), takeUntil(this.unsubscriber$))
      .subscribe(([api, blocks]) => {
        this.save();
      });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscriber$.next();
  }

  highlight(word?: string): void {
    if (!word) {
      word = this.highlightValue.value;
    }
    if (!word) {
      return;
    }
    this.removeOldHighlighted();
    this.editor.nativeElement.querySelectorAll('.ce-block').forEach((block) => {
      block.innerHTML = block.innerHTML.replace(
        new RegExp(word, 'g'),
        `<span class="highlighted" style="background-color: red">${word}</span>`
      );
    });
    // this.editor.nativeElement.innerHTML = this.editor.nativeElement.innerHTML.replace(
    //   new RegExp(word, 'g'),
    //   `<span class="highlighted" style="background-color: red">${word}</span>`
    // );
    this.cd.markForCheck();
  }

  copy2Clipboard(): void {
    const elm = document.createElement('textarea');
    elm.value = [...this.editor.nativeElement.querySelectorAll('.ce-block')]
      .map((block) => block.textContent)
      .join();
    document.body.appendChild(elm);
    elm.select();
    elm.setSelectionRange(0, 9999);
    document.execCommand('copy');
    document.body.removeChild(elm);
  }

  removeOldHighlighted(): void {
    this.editor.nativeElement
      .querySelectorAll('.highlighted')
      .forEach((elm) => {
        elm.insertAdjacentHTML('beforebegin', elm.textContent);
        elm.remove();
      });
  }

  private save(): void {
    this.editorJs.save().then((output) => {
      localStorage.setItem(this.outputDataKey, JSON.stringify(output));
    });
  }
}

/**
 * 下に波線
 * 差し込みができるものか
 *
 */
