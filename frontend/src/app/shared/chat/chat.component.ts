import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fromEvent, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/typing';

interface Message {
  body: string;
  author: User;
  created: Date;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
  messages: Message[] = [];

  chatForm = new FormGroup({
    body: new FormControl('', [Validators.required, Validators.minLength(10)]),
  });

  @ViewChild('form') formElement: ElementRef;

  private unsubscriber$ = new Subject<void>();

  constructor(
    // private wsService: WsService<string>,
    private cd: ChangeDetectorRef,
    private authenticationService: AuthenticationService,
    private renderer: Renderer2
  ) {
    // this.wsService.connect();
    // this.wsService.message$.pipe(takeUntil(this.unsubscriber$)).subscribe(
    //   (message: any) => {
    //     if (this.text !== message.message) {
    //       this.text = message.message;
    //       this.cd.markForCheck();
    //     }
    //   },
    //   (err) => {
    //     console.log('erro', err);
    //   },
    //   () => {
    //     console.log('complete');
    //   }
    // );
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    fromEvent(this.formElement.nativeElement, 'keydown')
      .pipe(
        filter((event: KeyboardEvent) => event.ctrlKey && event.keyCode === 13),
        takeUntil(this.unsubscriber$)
      )
      .subscribe((event: KeyboardEvent) => {
        this.save();
      });
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
  }

  save(): void {
    if (!this.chatForm.valid) {
      return;
    }
    const msg: Message = {
      body: this.chatForm.get('body').value,
      author: this.authenticationService.user,
      created: new Date(),
    };
    this.messages.push(msg);
    this.chatForm.reset();
    this.cd.markForCheck();
  }

  change(event: string): void {
    // this.wsService.sendMessage({ message: event });
  }
}
