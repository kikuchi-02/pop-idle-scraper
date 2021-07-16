import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { WsService } from 'src/app/services/ws.service';
import { Message } from 'src/app/typing';
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
    private chatService: ChatService
  ) {
    const params = this.route.snapshot.paramMap;
    const scriptId = params.get('id');
    if (scriptId === 'new') {
      this.disabled = true;
    } else {
      this.scriptId = parseInt(scriptId, 10);

      this.chatService
        .getMessages(this.scriptId)
        .pipe(takeUntil(this.unsubscriber$))
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
        filter((event: KeyboardEvent) => event.ctrlKey && event.keyCode === 13),
        takeUntil(this.unsubscriber$)
      )
      .subscribe((event: KeyboardEvent) => {
        this.submit();
      });
    this.scrollToMessageBottom();
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
      created: new Date(),
      scriptId: this.scriptId,
    };
    this.messages.push(msg);
    this.wsService.sendMessage(this.wsMessageType, msg);
    this.chatService
      .postMessage(msg)
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe();
    this.chatForm.reset();
    this.cd.markForCheck();
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
