import {
  Directive,
  DoCheck,
  ElementRef,
  forwardRef,
  HostBinding,
  HostListener,
  OnDestroy,
  Renderer2,
  SecurityContext,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { auditTime, takeUntil } from 'rxjs/operators';
import { UndoRedoService } from 'src/app/services/undo-redo.service';

@Directive({
  selector: '[appEditable]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditableDirective),
      multi: true,
    },
    UndoRedoService,
  ],
})
export class EditableDirective
  implements ControlValueAccessor, DoCheck, OnDestroy {
  @HostBinding('attr.contenteditable') contentEditable = true;

  private registerer$ = new Subject<string>();
  private unsubscriber$ = new Subject<void>();

  constructor(
    public elementRef: ElementRef,
    private renderer: Renderer2,
    private sanitizer: DomSanitizer,
    private undoRedoService: UndoRedoService<string>
  ) {
    this.registerer$
      .pipe(auditTime(300), takeUntil(this.unsubscriber$))
      .subscribe((innerHtml) => {
        this.undoRedoService.register(innerHtml);
      });
  }

  ngDoCheck(): void {
    const innerHtml = this.elementRef.nativeElement.innerHTML;
    this.registerer$.next(innerHtml);
  }

  ngOnDestroy() {
    this.unsubscriber$.next();
  }

  private onTouched = () => {};

  private onChange: (value: string) => void = () => {};

  registerOnChange(onChange: (value: string) => void): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  writeValue(value: string): void {
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      'innerHTML',
      this.sanitizer.sanitize(
        SecurityContext.HTML,
        this.sanitizer.bypassSecurityTrustHtml(value)
      )
    );
  }

  @HostListener('input')
  onInput(): void {
    this.onChange(this.elementRef.nativeElement.innerHTML);
  }

  @HostListener('paste', ['$event'])
  preventFormattedPast(event: ClipboardEvent): void {
    event.preventDefault();
    const { clipboardData } = event;
    const text =
      clipboardData.getData('text/plain') || clipboardData.getData('text');
    document.execCommand('insertText', false, text);
  }

  clearContent(): void {
    this.elementRef.nativeElement.innerHTML = '';
  }

  insertTextContent(text: string): void {
    const range = document.createRange();
    const last = this.elementRef.nativeElement.childNodes.length;
    range.setStart(this.elementRef.nativeElement, last);
    range.setEnd(this.elementRef.nativeElement, last);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('insertText', false, text);
  }

  undo() {
    if (this.undoRedoService.ableToUndo) {
      const innerHtml = this.undoRedoService.undo();
      this.elementRef.nativeElement.innerHTML = innerHtml;
    }
  }
  redo() {
    if (this.undoRedoService.ableToRedo) {
      const innerHtml = this.undoRedoService.redo();
      this.elementRef.nativeElement.innerHTML = innerHtml;
    }
  }

  @HostListener('keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    if (event.ctrlKey && event.keyCode === 90) {
      if (event.shiftKey) {
        this.undo();
      } else {
        this.redo();
      }
    }
  }
}
