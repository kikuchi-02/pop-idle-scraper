import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import EditorJS, { API, BlockAPI, OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Marker from '@editorjs/marker';
import { from, Observable, Subject } from 'rxjs';
import { auditTime, debounceTime, mergeMap, takeUntil } from 'rxjs/operators';
import { EditableDirective } from './editable.directive';
import { EditorService } from './editor.service';
import { MarkerTool, MyInlineTool } from './tools';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class EditorComponent implements OnInit, OnDestroy {
  @ViewChild('editor') editor: ElementRef;

  loading = true;

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
      this.loading = false;
      this.cd.markForCheck();
    },
    onChange: (api, blocks) => {
      this.editorSubject$.next([api, blocks]);
    },
  });

  private unsubscriber$ = new Subject<void>();
  private editorSubject$ = new Subject<[API, BlockAPI]>();

  constructor(
    private cd: ChangeDetectorRef,
    private editorService: EditorService
  ) {
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
      this.recursivelyApply(block, (elm) => {
        const msg = 'hello';
        elm.innerHTML = elm.innerHTML.replace(
          new RegExp(word, 'g'),
          `<span class="text--underlined">${word}<span class="underline-text">${msg}</span></span>`
        );
      });
    });
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
      .querySelectorAll('.text--underlined')
      .forEach((elm: Element) => {
        Array.from(elm.children).forEach((child) => child.remove());
        elm.insertAdjacentHTML('beforebegin', elm.textContent);
        elm.remove();
      });
  }

  cleanupNode(node: Node): void {
    // multiple className ?
    if ((node as Element).className === 'text--underlined') {
      (node as Element).insertAdjacentHTML('beforebegin', node.textContent);
      (node as Element).remove();
    } else if (node.nodeName === '#text') {
    } else {
      node.childNodes.forEach((child: Node) => {
        this.cleanupNode(child);
      });
    }
  }

  tokenize(): void {
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.cd.markForCheck();

    // const text = 'こんにちは、私の名前は田中太郎です。よろしくね。';
    this.rawBlocks().forEach((block) => {
      this.cleanupNode(block);
      this.recursiveTextNodeFunc(block, (textNode) => {
        this.editorService
          .tokenize(textNode.textContent)
          .subscribe((tokens) => {
            console.log('some logic');
            // TODO

            const result = textNode.textContent;
            textNode.textContent = result;
          });
      });
    });
    this.loading = false;
    this.cd.markForCheck();
  }

  constituencyParse(): void {
    this.getEditorOutput()
      .pipe(
        mergeMap((output) => {
          const textBlocks = output.blocks.map((block) => block.data.text);
          return this.editorService.constituencyParse(textBlocks);
        }),
        takeUntil(this.unsubscriber$)
      )
      .subscribe((result) => {
        this.rawBlocks().forEach((block, i) => {
          const targetBlock = result[i];
          (block as Element).innerHTML = (block as Element).innerHTML
            .split('。')
            .map((sentence, j) => {
              const targetSentence = targetBlock[j];
              // TODO
              return sentence;
            })
            .join();
        });
        this.cd.markForCheck();
      });
  }

  private recursiveTextNodeFunc(
    node: Node,
    callback: (textNode: Node) => void
  ): void {
    if (node.nodeName === '#text') {
      callback(node);
    } else {
      node.childNodes.forEach((child) => {
        this.recursiveTextNodeFunc(child, callback);
      });
    }
  }

  private getEditorOutput(): Observable<OutputData> {
    return from(this.editorJs.save());
  }

  private save(): void {
    this.getEditorOutput().subscribe((output) => {
      localStorage.setItem(this.outputDataKey, JSON.stringify(output));
    });
  }

  private recursivelyApply(
    element: Element,
    callback: (element: Element) => void
  ): void {
    if (element.childElementCount === 0) {
      callback(element);
    } else {
      Array.from(element.children).forEach((child) => {
        this.recursivelyApply(child, callback);
      });
    }
  }

  private rawBlocks(): Node[] {
    return this.editor.nativeElement.querySelectorAll('.ce-block');
  }
}

/**
 * 下に波線
 * 差し込みができるものか
 *
 */
