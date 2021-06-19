import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appEditable]',
})
export class EditableDirective {
  @HostBinding('attr.contenteditable') contentEditable = true;

  constructor() {
    console.log('init');
  }

  @HostListener('input')
  callOnChange(event): void {
    // if (typeof this.onChange === 'function') {
    //   this.onChange(this.el.nativeElement[this.propValueAccesor]);
    // }
    // if (this.okraElement && this.okraElement.data.elements.length > 1) {
    //   this.okraElement.getPosition();
    // }
    // if (!this.data) {
    //   this.previewWindowService.valueChanges();
    // }
    // console.log('input chnage', event);
  }
}
