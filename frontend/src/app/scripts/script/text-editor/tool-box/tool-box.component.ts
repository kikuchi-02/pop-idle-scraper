import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { forkJoin, from, of, Subject } from 'rxjs';
import { map, mergeMap, takeUntil } from 'rxjs/operators';
import { ScriptService } from '../../script.service';

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

  @Input() value: string;
  @Output() valueChange = new EventEmitter<string>();

  @Output() setText = new EventEmitter<string>();

  @Output() toggleSubtitleButton = new EventEmitter<void>();

  @Output() loadingStateChange = new EventEmitter<boolean>();

  private toolBoxHighlightKey = 'tool-box-highlight-key';
  private toolBoxUnderlineKey = 'tool-box-underline-key';

  private unsubscriber$ = new Subject<void>();

  constructor(
    private renderer: Renderer2,
    private cd: ChangeDetectorRef,
    private scriptService: ScriptService
  ) {
    const highlightValue = localStorage.getItem(this.toolBoxHighlightKey);
    if (highlightValue) {
      this.highlightValue.setValue(highlightValue);
    }
    const underlineValue = localStorage.getItem(this.toolBoxUnderlineKey);
    if (underlineValue) {
      this.underlineValue.setValue(underlineValue);
    }
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

    const elm = this.renderer.createElement('div');
    elm.innerHTML = this.value;

    this.recursiveTextNodeFunc(elm, (textNode) => {
      const parent = textNode.parentNode as Element;
      if (parent.tagName === 'MARK') {
        return;
      }
      const indexes = [...Array(textNode.nodeValue.length)]
        .map((_, i) => i)
        .filter((i) => textNode.nodeValue.substring(i).startsWith(word));
      if (indexes.length === 0) {
        return;
      }
      const nodes: Node[] = [];
      let start = 0;
      for (const idx of indexes) {
        const mark = this.renderer.createElement('mark');
        mark.appendChild(this.renderer.createText(word));
        const text = textNode.nodeValue.substring(start, idx);
        start = idx + word.length;

        nodes.push(this.renderer.createText(text), mark);
      }
      nodes.push(this.renderer.createText(textNode.nodeValue.substring(start)));

      this.renderer.removeChild(parent, textNode);
      nodes.forEach((node) => {
        this.renderer.appendChild(parent, node);
      });
    });

    this.value = elm.innerHTML;
    this.valueChange.emit(this.value);
  }

  removeOldHighlighted(): void {
    const elm = this.renderer.createElement('div');
    elm.innerHTML = this.value;

    this.removeStyles(elm, ['highlight']);

    this.value = elm.innerHTML;
    this.valueChange.emit(this.value);
  }

  underlineSentenceByWord(word: string): void {
    if (!word) {
      return;
    }

    this.loadingStateChange.emit(true);

    this.scriptService
      .tokenize(word)
      .pipe(
        mergeMap((tokens) => {
          const baseFormWord = tokens[0].basic_form;
          if (baseFormWord === '*') {
            alert(`「${word}」の表層系が見つかりません。`);
            return of(undefined);
          }
          localStorage.setItem(this.toolBoxUnderlineKey, baseFormWord);
          return from(this.underlineSentence([baseFormWord]));
        }),
        takeUntil(this.unsubscriber$)
      )
      .subscribe(
        (innerHtml) => {
          if (innerHtml) {
            this.value = innerHtml;
            this.valueChange.emit(this.value);
          }
          this.loadingStateChange.emit(false);
        },
        (error) => {
          this.loadingStateChange.emit(false);
        }
      );
  }

  bulkUnderline(): void {
    const words = this.keywordValues.value;
    forkJoin(words.map((word: string) => this.scriptService.tokenize(word)))
      .pipe(
        map((tokensArray) => {
          const baseForms: string[] = tokensArray
            .map((tokens) => tokens[0].basic_form)
            .filter((baseForm) => baseForm !== '*');
          return baseForms;
        }),
        mergeMap((baseForms) => {
          return from(this.underlineSentence(baseForms));
        }),
        takeUntil(this.unsubscriber$)
      )
      .subscribe(
        (innerHtml) => {
          if (innerHtml) {
            this.value = innerHtml;
            this.valueChange.emit(this.value);
          }
          this.loadingStateChange.emit(false);
        },
        (error) => {
          this.loadingStateChange.emit(false);
        }
      );
  }

  removeAllUnderlinedSentences(): void {
    const elm = this.renderer.createElement('div');
    elm.innerHTML = this.value;

    this.removeStyles(elm, ['underline']);

    this.value = elm.innerHTML;
    this.valueChange.emit(this.value);
  }

  removeStrike(): void {
    const elm = this.renderer.createElement('div');
    elm.innerHTML = this.value;

    this.removeStyles(elm, ['strike']);

    this.value = elm.innerHTML;
    this.valueChange.emit(this.value);
  }

  reformat(): void {
    if (
      !confirm('highlightやunderlineなどのスタイルが外れますが実行しますか？')
    ) {
      return;
    }
    const elm = this.renderer.createElement('div');
    elm.innerHTML = this.value;

    this.removeStyles(elm);

    // const textContent = [...elm.childNodes]
    //   .map((node) => node.textContent)
    //   .join('\n');
    // const text = textContent;
    // // .replace(/\n(?!\n)/g, '');
    // const splitted = text
    //   .split(/。(?!\n)/g)
    //   .join('。\n')
    //   .replace(/(?<!\n)\n{2}(?!\n)/g, '\n');

    const textContent = [...elm.childNodes]
      .map((node) => {
        const content = node.textContent;
        return this.scriptService.splitTextByNewline(content);
      })
      .join('\n');
    const splitted = textContent.replace(/(?<!\n)\n{2}(?!\n)/g, '\n');

    this.setText.emit(splitted);
  }

  textLint(): void {
    const text = this.getText();
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

  private getText(): string {
    const elm = this.renderer.createElement('div');
    elm.innerHTML = this.value;

    const textContent = [...elm.childNodes]
      .map((node) => node.textContent)
      .join('\n');
    return textContent;
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

  private underlineSentence(baseFormWords: string[]): Promise<string> {
    const className = 'text--underlined';
    const elm = this.renderer.createElement('div');
    elm.innerHTML = this.value;

    return Promise.all(
      [...elm.childNodes].map((child) => {
        if (child.nodeType === 'SPAN' && child.className === className) {
          return Promise.resolve();
        }
        return this.scriptService
          .tokenize(child.textContent)
          .pipe(
            map(
              (tokens): string =>
                tokens.find((token) => baseFormWords.includes(token.basic_form))
                  ?.surface_form
            )
          )
          .toPromise()
          .then((surfaceForm) => {
            if (!surfaceForm) {
              return;
            }
            const underlineSpan = this.renderer.createElement('span');
            this.renderer.addClass(underlineSpan, className);
            this.renderer.addClass(underlineSpan, 'text__tooltip-relative');
            const tooltip = this.renderer.createElement('span');
            this.renderer.addClass(tooltip, 'text__tooltip-absolute');
            this.renderer.appendChild(
              tooltip,
              this.renderer.createText(surfaceForm)
            );
            this.renderer.appendChild(underlineSpan, tooltip);

            if (child.childNodes.length > 0) {
              child.childNodes.forEach((grandchild) => {
                this.renderer.appendChild(underlineSpan, grandchild);
              });
            }
            this.renderer.appendChild(child, underlineSpan);
          });
      })
    ).then(() => elm.innerHTML);
  }

  private removeStyles(elm, types?: ('highlight' | 'underline' | 'strike')[]) {
    if (!types) {
      types = ['highlight', 'underline', 'strike'];
    }
    types.forEach((value) => {
      switch (value) {
        case 'highlight':
          elm.querySelectorAll('mark').forEach((highlighted) => {
            highlighted.replaceWith(...highlighted.childNodes);
          });
        case 'underline':
          const className = 'text--underlined';
          elm.querySelectorAll(`.text__tooltip-absolute`).forEach((child) => {
            child.remove();
          });
          elm.querySelectorAll(`.${className}`).forEach((child) => {
            child.replaceWith(...child.childNodes);
          });
        case 'strike':
          elm.querySelectorAll('strike').forEach((child) => {
            child.replaceWith(...child.childNodes);
          });
      }
    });
  }
}
