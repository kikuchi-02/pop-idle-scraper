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
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { auditTime, takeUntil } from 'rxjs/operators';
import { UndoRedoService } from 'src/app/services/undo-redo.service';

interface EditableWebSocketMessage {
  innerHtml: string;
}

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

  private previousInnerHtml: string;
  private id: string;

  get wsMessageType(): string {
    return `editable-directive-script-${this.id}`;
  }

  constructor(
    public elementRef: ElementRef,
    private renderer: Renderer2,
    private sanitizer: DomSanitizer,
    private undoRedoService: UndoRedoService<string>,
    // private wsService: WsService<EditableWebSocketMessage>,
    private route: ActivatedRoute
  ) {
    const params = this.route.snapshot.paramMap;
    this.id = params.get('id');

    this.registerer$
      .pipe(auditTime(300), takeUntil(this.unsubscriber$))
      .subscribe((innerHtml) => {
        this.undoRedoService.register(innerHtml);
      });

    // this.wsService
    //   .messageReceiver(this.wsMessageType)
    //   .pipe(takeUntil(this.unsubscriber$))
    //   .subscribe((msg) => {
    //     this.elementRef.nativeElement.innerHTML = msg.innerHtml;
    //   });
  }

  ngDoCheck(): void {
    const innerHtml = this.elementRef.nativeElement.innerHTML;
    if (
      this.previousInnerHtml === undefined ||
      this.previousInnerHtml !== innerHtml
    ) {
      this.onChangeInnerHtml(innerHtml);
      this.previousInnerHtml = innerHtml;
    }
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

  undo(): void {
    if (this.undoRedoService.ableToUndo) {
      const innerHtml = this.undoRedoService.undo();
      this.elementRef.nativeElement.innerHTML = innerHtml;
    }
  }
  redo(): void {
    if (this.undoRedoService.ableToRedo) {
      const innerHtml = this.undoRedoService.redo();
      this.elementRef.nativeElement.innerHTML = innerHtml;
    }
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

  private onChangeInnerHtml(innerHtml: string): void {
    this.registerer$.next(innerHtml);

    // this.wsService.sendMessage(this.wsMessageType, { innerHtml });
  }
}
