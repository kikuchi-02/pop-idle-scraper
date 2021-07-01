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
import { first } from 'rxjs/operators';
import { TextEditorService } from '../text-editor.service';

@Component({
  selector: 'app-tool-box',
  templateUrl: './tool-box.component.html',
  styleUrls: ['./tool-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolBoxComponent implements OnInit {
  highlightValue = new FormControl('');

  @Input() value: string;
  @Output() valueChange = new EventEmitter<string>();

  @Output() setText = new EventEmitter<string>();

  @Output() toggleSubtitleButton = new EventEmitter<void>();

  private toolBoxHighlightKey = 'tool-box-highlight-key';

  constructor(
    private renderer: Renderer2,
    private cd: ChangeDetectorRef,
    private textEditorService: TextEditorService
  ) {
    const highlightValue = localStorage.getItem(this.toolBoxHighlightKey);
    if (highlightValue) {
      this.highlightValue.setValue(highlightValue);
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

    const className = 'text--highlighted';

    this.recursiveTextNodeFunc(elm, (textNode) => {
      const parent = textNode.parentNode as Element;
      if (parent.tagName === 'SPAN' && parent.className === className) {
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
        const span = this.renderer.createElement('span');
        this.renderer.addClass(span, className);
        span.appendChild(this.renderer.createText(word));
        const text = textNode.nodeValue.substring(start, idx);
        start = idx + word.length;

        nodes.push(this.renderer.createText(text), span);
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
    elm.querySelectorAll('.text--highlighted').forEach((highlighted) => {
      highlighted.replaceWith(...highlighted.childNodes);
    });

    this.value = elm.innerHTML;
    this.valueChange.emit(this.value);
  }

  reformat(): void {
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
  tokenize(): void {}
  constituencyParse(): void {}

  textLint(): void {
    this.textEditorService
      .textLint(this.getText())
      .pipe(first())
      .subscribe(() => {});
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
}
