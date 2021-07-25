import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, fromEvent, Observable, Subject } from 'rxjs';
import { filter, first, map, mergeMap, takeUntil } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { WsService } from 'src/app/services/ws.service';
import { Message } from 'src/app/typing';
import { EditorService } from '../editor.service';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
  messages: Message[] = [];
  disabled = false;

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

  private unsubscriber$ = new Subject<void>();
  initialized$ = new BehaviorSubject<boolean>(false);

  constructor(
    private wsService: WsService<Message>,
    private cd: ChangeDetectorRef,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private chatService: ChatService,
    private editorService: EditorService
  ) {
    const params = this.route.snapshot.paramMap;
    const scriptId = params.get('id');
    if (scriptId === 'new') {
      this.disabled = true;
    } else {
      this.scriptId = parseInt(scriptId, 10);

      this.chatService
        .getMessages(this.scriptId)
        .pipe(
          mergeMap(
            (messages: Message[]): Observable<Message[]> => {
              return this.editorService.initialized$.pipe(
                first(),
                map(() => {
                  const uuids = messages.reduce((acc, message, index) => {
                    acc[message.uuid] = index;
                    return acc;
                  }, {});
                  const deltaOps = this.editorService.getDelta();
                  deltaOps.forEach((delta) => {
                    if (!delta.attributes?.comment?.uuid) {
                      return;
                    }
                    const index = uuids[delta.attributes.comment.uuid];
                    if (index) {
                      messages[index].selectedText =
                        (messages[index].selectedText || '') + delta.insert;
                    } else {
                      delete delta.attributes.comment;
                    }
                  });
                  return messages;
                })
              );
            }
          ),
          takeUntil(this.unsubscriber$)
        )
        .subscribe(
          (messages) => {
            this.messages = messages;
            this.initialized$.next(true);
            this.cd.markForCheck();
          },
          (error) => {
            this.initialized$.next(true);
            console.error(error);
          }
        );
    }
    this.wsService.connect();
    this.wsService
      .messageReceiver(this.wsMessageType)
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe(
        (message) => {
          this.messages.push(message);
          this.scrollToMessageBottom();
          this.cd.markForCheck();
        },
        (err) => {
          console.log('error', err);
        },
        () => {
          console.log('complete');
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
    this.scrollToMessageBottom();

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
        focusMessage.expanded = true;
        this.activeMessage = focusMessage;
        this.cd.markForCheck();
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
        const commentedElement = (event.target as any).closest('[data-uuid]');
        if (!commentedElement) {
          // this.editorService.selectionCommentUnfocused(this.activeMessage.uuid);
          this.activeMessage = undefined;
          this.cd.markForCheck();
        }
      }
    }
  }

  messageClick(message: Message): void {
    const uuid = message.uuid;
    if (message.expanded) {
      this.activeMessage = undefined;
      message.expanded = false;
      this.editorService.selectionCommentUnfocused(uuid);
      this.cd.markForCheck();
      return;
    }

    message.expanded = true;

    this.activeMessage = message;
    this.formElement.nativeElement.querySelector('textarea').focus();

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
        } else {
          this.messages.push(message);
        }

        this.wsService.sendMessage(this.wsMessageType, message);

        if (this.selected.uuid) {
          this.editorService.selectionCommentUnfocused(this.selected.uuid);
          this.selected.uuid = undefined;
          this.selected.text = undefined;
        }
        this.chatForm.reset();
        this.cd.markForCheck();
      });
  }

  /**
   * TODO
   */
  private scrollToMessageBottom(): void {
    // this.initialized$
    //   .pipe(
    //     filter((v) => v),
    //     first(),
    //     takeUntil(this.unsubscriber$)
    //   )
    //   .subscribe(() => {
    //     this.chatMessageElement.nativeElement.scrollTop = this.chatMessageElement.nativeElement.scrollHeight;
    //   });
  }
}
