import {
  Directive,
  DoCheck,
  ElementRef,
  forwardRef,
  HostBinding,
  HostListener,
  NgZone,
  OnChanges,
  OnDestroy,
  Renderer2,
  SecurityContext,
  SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, first, takeUntil } from 'rxjs/operators';
import { CrdtTextService } from 'src/app/services/crdt-text.service';

// tslint:disable-next-line: no-conflicting-lifecycle
@Directive({
  selector: '[appEditable]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditableDirective),
      multi: true,
    },
    CrdtTextService,
  ],
})
export class EditableDirective
  implements ControlValueAccessor, DoCheck, OnDestroy, OnChanges {
  @HostBinding('attr.contenteditable') contentEditable = true;

  private unsubscriber$ = new Subject<void>();

  private id: string;
  private initialized$ = new BehaviorSubject<boolean>(false);
  private changed$ = new Subject<string>();

  get wsMessageType(): string {
    return `editable-directive-script-${this.id}`;
  }

  constructor(
    public elementRef: ElementRef,
    private renderer: Renderer2,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private crdtTextService: CrdtTextService,
    private ngZone: NgZone
  ) {
    const params = this.route.snapshot.paramMap;
    this.id = params.get('id');

    this.initialized$
      .pipe(
        filter((v) => v),
        first(),
        takeUntil(this.unsubscriber$)
      )
      .subscribe(() => {
        const nativeElement = this.elementRef.nativeElement;
        const innerHtml = nativeElement.innerHTML;
        const ytxt = this.crdtTextService.createText(
          `script-${this.id}`,
          innerHtml
        );
        nativeElement.innerHTML = ytxt || innerHtml;
        console.log('after view init ', nativeElement.innerHTML, ytxt);
        // this.cd.detectChanges();
        this.onChangeInnerHtml();
        this.crdtTextService.registerObserver((txt, delta) => {
          console.log({ txt }, 'observe');
          if (txt === nativeElement.innerHTML) {
            return;
          }
          const current = this.crdtTextService.applyDeltaToCurrent(delta, {
            txt: nativeElement.innerHTML,
            selectionStart: nativeElement.selectionStart,
            selectionEnd: nativeElement.selectionEnd,
          });
          nativeElement.innerHTML = current.txt;
          // this.onChangeInnerHtml();

          if (
            current.selectionStart !== undefined &&
            current.selectionEnd !== undefined
          ) {
            this.ngZone.onStable
              .pipe(first(), takeUntil(this.unsubscriber$))
              .subscribe(() => {
                nativeElement.setSelectionRange(
                  current.selectionStart,
                  current.selectionEnd
                );
              });
          }
        });
      });

    // this.changed$
    //   .pipe(
    //     distinctUntilChanged(),
    //     debounceTime(100),
    //     takeUntil(this.unsubscriber$)
    //   )
    //   .subscribe((value) => {
    //     console.log('debouce changed', value);
    //     this.crdtTextService.onTextChange(value);
    //   });
  }

  ngDoCheck(): void {
    this.ngZone.onStable
      .pipe(first(), takeUntil(this.unsubscriber$))
      .subscribe(() => {
        const txt = this.elementRef.nativeElement.innerHTML;
        console.log({ txt }, 'do check');
        this.onChangeInnerHtml();
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log({ txt: changes }, 'onchange');
  }

  private cInnner: undefined;
  @HostBinding('innerHTML') set v(v) {
    console.log({ txt: v }, 'set');
    this.cInnner = v;
  }
  get v() {
    return this.cInnner;
  }

  ngOnDestroy(): void {
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
    if (value === null) {
      return;
    }
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      'innerHTML',
      this.sanitizer.sanitize(
        SecurityContext.HTML,
        this.sanitizer.bypassSecurityTrustHtml(value)
      )
    );
    if (this.initialized$.getValue()) {
      console.log({ txt: value }, 'write');
      this.onChangeInnerHtml();
    } else {
      this.initialized$.next(true);
    }
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

  undo(): void {
    this.crdtTextService.undo();
  }
  redo(): void {
    this.crdtTextService.redo();
  }

  @HostListener('keydown', ['$event'])
  keyDown(event: KeyboardEvent): void {
    if (event.ctrlKey && event.keyCode === 90) {
      if (event.shiftKey) {
        this.undo();
      } else {
        this.redo();
      }
    }
  }

  private onChangeInnerHtml(): void {
    const innerHtml2 = this.elementRef.nativeElement.innerHTML;
    console.log({ txt: innerHtml2 }, 'on changeInner');
    setTimeout(() => {
      const innerHtml = this.elementRef.nativeElement.innerHTML;
      console.log({ txt: innerHtml }, 'afterl kon changeINner');
      // console.log('on change', innerHtml);
      // this.crdtTextService.onTextChange(innerHtml);
      this.crdtTextService.onTextChange(innerHtml);
      // this.changed$.next(innerHtml);
    }, 0);
  }
}
