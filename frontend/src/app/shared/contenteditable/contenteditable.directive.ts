import {
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  Renderer2,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appContenteditable]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ContenteditableDirective),
      multi: true,
    },
  ],
})
export class ContenteditableDirective implements ControlValueAccessor {
  private onTouched = () => {};
  private onChange: (value: string) => void = () => {};

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  @HostListener('input')
  onInput(): void {
    this.onChange(this.processValue(this.elementRef.nativeElement.innerHTML));
  }

  /*
   * Listen to blur event to mark control as touched
   */
  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
  }

  /*
   * Reacts to external change
   *
   * @see {@link ControlValueAccessor#writeValue}
   */
  writeValue(value: string | null): void {
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      'innerHTML',
      this.processValue(value)
    );
  }

  registerOnChange(onChange: (value: string) => void): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean): void {
    this.renderer.setAttribute(
      this.elementRef.nativeElement,
      'contenteditable',
      String(!disabled)
    );
  }

  private processValue(value: string): string {
    return value.trim() === '<br>' ? '' : value;
  }
}
