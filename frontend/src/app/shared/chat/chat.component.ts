import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { Subject } from 'rxjs';
import { WsService } from '../../services/ws.service';
import { takeUntil } from 'rxjs/operators';

interface Message {
  message: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit, OnDestroy {
  text = '';

  private unsubscriber$ = new Subject<void>();

  constructor(
    private wsService: WsService<Message>,
    private cd: ChangeDetectorRef
  ) {
    this.wsService.connect();
    this.wsService.message$.pipe(takeUntil(this.unsubscriber$)).subscribe(
      (message: any) => {
        if (this.text !== message.message) {
          this.text = message.message;
          this.cd.markForCheck();
        }
      },
      (err) => {
        console.log('erro', err);
      },
      () => {
        console.log('complete');
      }
    );
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.unsubscriber$.next();
  }

  save() {}

  change(event: string) {
    this.wsService.sendMessage({ message: event });
  }
}
