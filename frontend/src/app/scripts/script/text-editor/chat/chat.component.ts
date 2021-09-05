import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, forkJoin, fromEvent, Subject } from 'rxjs';
import {
  catchError,
  filter,
  first,
  map,
  mergeMap,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Message } from 'src/app/typing';
import { EditorService } from '../editor.service';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ChatService],
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
  messages: Message[] = [];

  private disable = true;
  get disabled(): boolean {
    return this.disable;
  }
  set disabled(val: boolean) {
    this.disable = val;
    this.chatForm.controls.body.enable();
  }

  chatForm = new FormGroup({
    body: new FormControl({ value: '', disabled: this.disabled }, [
      Validators.required,
      Validators.minLength(1),
    ]),
  });

  selected: { uuid: string; text: string } = {
    uuid: undefined,
    text: undefined,
  };

  activeMessage: Message;

  private scriptId: number;
  private get wsMessageType(): string {
    return `chat-${this.scriptId}`;
  }

  @ViewChild('form') formElement: ElementRef;
  @ViewChild('chatMessage') chatMessageElement: ElementRef;

  @Input() darkTheme: boolean;

  private unsubscriber$ = new Subject<void>();
  initialized$ = new BehaviorSubject<boolean>(false);

  constructor(
    private cd: ChangeDetectorRef,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private chatService: ChatService,
    private editorService: EditorService
  ) {
    this.route.paramMap
      .pipe(
        filter((params) => {
          const scriptId = params.get('id');
          return scriptId !== 'new';
        }),
        switchMap((params) => {
          const scriptId = params.get('id');
          this.scriptId = parseInt(scriptId, 10);

          return forkJoin([
            this.chatService.getMessages(this.scriptId),
            this.editorService.initialized$.pipe(first()),
          ]);
        }),
        catchError((error) => undefined),
        filter((v) => !!v),
        first(),
        mergeMap(([messages, _]: [Message[], void]) =>
          this.chatService.createArray(this.wsMessageType).pipe(
            map((wsMessages, index) => {
              if (index === 0) {
                if (messages.length > 0 && wsMessages.length === 0) {
                  this.chatService.insertArray(0, ...messages);
                }
                this.disabled = false;
                this.messages = this.editorService.initialComments(messages);
                this.initialized$.next(true);
              } else {
                this.messages = wsMessages;
              }
            })
          )
        ),
        takeUntil(this.unsubscriber$)
      )
      .subscribe(
        () => {
          this.cd.markForCheck();
        },
        (error) => {
          this.initialized$.next(true);
        }
      );
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    fromEvent(this.formElement.nativeElement, 'keydown')
      .pipe(
        filter(
          (event: KeyboardEvent) => event.ctrlKey && event.key === 'Enter'
        ),
        takeUntil(this.unsubscriber$)
      )
      .subscribe((event: KeyboardEvent) => {
        this.submit();
      });

    this.editorService.commentSubject$
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((uuid) => {
        this.selected.uuid = uuid;
        this.selected.text = this.editorService.selectionCommentText(uuid);
        this.formElement.nativeElement.querySelector('textarea').focus();
        this.cd.markForCheck();
      });

    this.initialized$
      .pipe(
        filter((v) => v),
        mergeMap(() => this.editorService.focusChatMessage$),
        takeUntil(this.unsubscriber$)
      )
      .subscribe((uuid) => {
        const focusMessage = this.messages.find(
          (message) => message.uuid === uuid
        );
        if (focusMessage) {
          focusMessage.expanded = true;
          this.activeMessage = focusMessage;
          this.cd.markForCheck();
        }
      });
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    const inner = !!(event.target as any).closest('app-chat');
    if (!inner) {
      const textArea = this.formElement.nativeElement.querySelector('textarea');
      if (
        this.selected.uuid !== undefined &&
        document.activeElement !== textArea
      ) {
        this.editorService.unselectComment(this.selected.uuid);
        this.selected.uuid = undefined;
        this.selected.text = undefined;
      }

      if (!!this.activeMessage) {
        const commentedElement = (event.target as any).closest(
          '[data-comment-uuid]'
        );
        if (!commentedElement) {
          this.activeMessage = undefined;
          this.cd.markForCheck();
        }
      }
    }
  }

  messageClick(message: Message, state?: 'open' | 'close'): void {
    let open: boolean;
    switch (state) {
      case 'open':
        open = true;
        break;
      case 'close':
        open = false;
        break;
      default:
        open = !message.expanded;
        break;
    }

    if (open) {
      message.expanded = true;
      this.activeMessage = message;
      this.formElement.nativeElement.querySelector('textarea').focus();
    } else {
      this.activeMessage = undefined;
      message.expanded = false;
      this.cd.markForCheck();
    }

    const uuid = message.uuid;
    if (uuid) {
      this.editorService.selectionCommentFocused(uuid);
      this.selected.text = this.editorService.selectionCommentText(uuid);
      this.cd.markForCheck();
    }
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
  }

  submit(): void {
    if (!this.chatForm.valid || this.disabled) {
      return;
    }

    const msg: Message = {
      body: this.chatForm.get('body').value,
      author: this.authenticationService.user,
      scriptId: this.scriptId,
      uuid: this.selected.uuid,
      parentId: this.activeMessage?.id,
    };
    this.chatService
      .postMessage(msg)
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((message) => {
        message.selectedText = this.selected.text;

        if (this.activeMessage?.id) {
          const parent = this.messages.findIndex(
            (parentMessage) => parentMessage.id === this.activeMessage.id
          );
          if (this.messages[parent].children) {
            this.messages[parent].children.push(message);
          } else {
            this.messages[parent].children = [message];
          }
          this.chatService.spliceArray(parent, 1, this.messages[parent]);
        } else {
          this.chatService.pushArray(message);
        }

        if (message.uuid) {
          this.editorService.applySelectionCommentMessage(
            message.uuid,
            message.body
          );
          this.selected.uuid = undefined;
          this.selected.text = undefined;
        }
        this.chatForm.reset();
        this.cd.markForCheck();
      });
  }

  deleteMessage(message: Message): void {
    const delMsg = (msgs: Message[]): void => {
      msgs.forEach((msg, i) => {
        if (msg.id === message.id) {
          msgs.splice(i, 1);
          return;
        }

        if (msg.children) {
          delMsg(msg.children);
        }
      });
    };

    delMsg(this.messages);

    this.chatService
      .deleteMessage(message.id)
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe(() => {
        this.cd.markForCheck();
      });
  }
}
