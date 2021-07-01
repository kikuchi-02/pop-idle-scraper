import {
  Directive,
  ElementRef,
  forwardRef,
  HostBinding,
  HostListener,
  Renderer2,
  SecurityContext,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Directive({
  selector: '[appEditable]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditableDirective),
      multi: true,
    },
  ],
})
export class EditableDirective implements ControlValueAccessor {
  @HostBinding('attr.contenteditable') contentEditable = true;

  constructor(
    public elementRef: ElementRef,
    private renderer: Renderer2,
    private sanitizer: DomSanitizer
  ) {}

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
}
