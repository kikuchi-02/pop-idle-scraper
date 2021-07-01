import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

import { EditableDirective } from './editable.directive';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextEditorComponent implements OnInit, AfterViewInit {
  blurred = false;
  focused = false;

  innerHtml = '';
  showSubtitleLine = true;

  @ViewChild(EditableDirective) editableDirective: EditableDirective;

  private editorLocalStorageKey = 'editor-output';

  constructor(private cd: ChangeDetectorRef) {
    this.restore();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  setTextContent(text: string): void {
    this.editableDirective.clearContent();
    this.editableDirective.insertTextContent(text);
  }

  save(): void {
    localStorage.setItem(this.editorLocalStorageKey, this.innerHtml);
  }
  restore(): void {
    const innerHtml = localStorage.getItem(this.editorLocalStorageKey);
    if (innerHtml) {
      this.innerHtml = innerHtml;
    }
    this.cd.markForCheck();
  }

  copy2Clipboard(): void {
    const elm = document.createElement('textarea');
    elm.value = this.innerHtml;
    document.body.appendChild(elm);
    elm.select();
    elm.setSelectionRange(0, 9999);
    document.execCommand('copy');
    document.body.removeChild(elm);
  }
}
