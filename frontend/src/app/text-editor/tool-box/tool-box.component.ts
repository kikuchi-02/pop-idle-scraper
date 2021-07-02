import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { from, Observable, of } from 'rxjs';
import { first, map, mergeMap, tap } from 'rxjs/operators';
import { TextEditorService } from '../text-editor.service';

@Component({
  selector: 'app-tool-box',
  templateUrl: './tool-box.component.html',
  styleUrls: ['./tool-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolBoxComponent implements OnInit {
  highlightValue = new FormControl('');
  underlineValue = new FormControl('');

  @Input() value: string;
  @Output() valueChange = new EventEmitter<string>();

  @Output() setText = new EventEmitter<string>();

  @Output() toggleSubtitleButton = new EventEmitter<void>();

  @Output() loadingStateChange = new EventEmitter<boolean>();

  private toolBoxHighlightKey = 'tool-box-highlight-key';
  private toolBoxUnderlineKey = 'tool-box-underline-key';

  constructor(
    private renderer: Renderer2,
    private cd: ChangeDetectorRef,
    private textEditorService: TextEditorService
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
    elm.querySelectorAll('mark').forEach((highlighted) => {
      highlighted.replaceWith(...highlighted.childNodes);
    });

    this.value = elm.innerHTML;
    this.valueChange.emit(this.value);
  }

  underlineSentence(word: string) {
    if (!word) {
      return;
    }

    this.loadingStateChange.emit(true);

    const className = 'text--underlined';
    const elm = this.renderer.createElement('div');
    elm.innerHTML = this.value;
    this.textEditorService
      .tokenize(word)
      .pipe(
        mergeMap((tokens) => {
          const baseFormWord = tokens[0].basic_form;
          if (baseFormWord === '*') {
            alert(`「${word}」の表層系が見つかりません。`);
            return of(undefined);
          }
          localStorage.setItem(this.toolBoxUnderlineKey, word);
          return from(
            Promise.all(
              [...elm.childNodes].map((child) => {
                if (
                  child.nodeType === 'SPAN' &&
                  child.className === className
                ) {
                  return Promise.resolve();
                }
                return this.includeWordForBaseForm(
                  child.textContent,
                  baseFormWord
                ).then((surfaceForm) => {
                  if (!surfaceForm) {
                    return;
                  }
                  const underlineSpan = this.renderer.createElement('span');
                  this.renderer.addClass(underlineSpan, className);
                  this.renderer.addClass(
                    underlineSpan,
                    'text__tooltip-relative'
                  );
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
            )
          );
        })
      )
      .subscribe(() => {
        this.value = elm.innerHTML;
        this.valueChange.emit(this.value);
        this.loadingStateChange.emit(false);
      });
  }

  removeAllUnderlinedSentences(): void {
    const className = 'text--underlined';
    const elm = this.renderer.createElement('div');
    elm.innerHTML = this.value;
    elm.querySelectorAll(`.text__tooltip-absolute`).forEach((child) => {
      child.remove();
    });
    elm.querySelectorAll(`.${className}`).forEach((child) => {
      child.replaceWith(...child.childNodes);
    });

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
        if (content.length < 2) {
          return content;
        }

        const patterns = [
          /「[^」]*」/g,
          /（[^）]*）/g,
          /\([^\)]*\)/g,
          /\[[^\]]*\]/g,
          /"[^"]*"/g,
          /”[^”]*”/g,
        ];
        let masked = content;
        patterns.forEach((pattern) => {
          masked = masked.replace(pattern, (match) => '#'.repeat(match.length));
        });

        let result = '';
        let start = 0;
        [...Array(masked.length - 1)].forEach((_, i) => {
          if (masked.charAt(i) === '。') {
            result += content.substring(start, i + 1) + '\n';
            start = i + 1;
          }
        });
        result += content.substring(start);

        return result;
      })
      .join('\n');
    const splitted = textContent.replace(/(?<!\n)\n{2}(?!\n)/g, '\n');

    this.setText.emit(splitted);
  }
  constituencyParse(): void {}

  textLint(): void {
    this.loadingStateChange.emit(true);
    this.textEditorService
      .textLint(this.getText())
      .pipe(first())
      .subscribe(() => {
        this.loadingStateChange.emit(false);
      });
  }

  scrollTop(): void {
    window.scrollTo(0, 0);
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

  private async includeWordForBaseForm(
    sentence: string,
    baseFormWord: string
  ): Promise<string> {
    return this.textEditorService
      .tokenize(sentence)
      .pipe(
        map(
          (tokens): string =>
            tokens.find((token) => token.basic_form === baseFormWord)
              ?.surface_form
        )
      )
      .toPromise();
  }
}
