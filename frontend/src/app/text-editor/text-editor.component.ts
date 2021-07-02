import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { BalloonComponent } from './balloon/balloon.component';

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
  loading = false;

  @ViewChild(EditableDirective) editableDirective: EditableDirective;
  @ViewChild(BalloonComponent) balloonComponent: BalloonComponent;

  private editorLocalStorageKey = 'editor-output';

  constructor(private cd: ChangeDetectorRef, private renderer: Renderer2) {
    this.restore();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.renderer.listen(
      this.editableDirective.elementRef.nativeElement,
      'mouseup',
      (event) => this.balloonComponent.selectionChange(event)
    );
  }

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
    const div = this.renderer.createElement('div');
    div.innerHTML = this.innerHtml;

    const textContent = [...div.childNodes]
      .map((node) => node.textContent)
      .join('\n');

    const elm = document.createElement('textarea');
    elm.value = textContent;
    document.body.appendChild(elm);
    elm.select();
    elm.setSelectionRange(0, 9999);
    document.execCommand('copy');
    document.body.removeChild(elm);
  }
}
