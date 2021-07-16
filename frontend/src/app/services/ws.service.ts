import { Injectable } from '@angular/core';
import { EMPTY, Observable, Subject, timer } from 'rxjs';
import {
  catchError,
  delayWhen,
  filter,
  map,
  retryWhen,
  tap,
} from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
// import { environment } from 'src/environments/environment';

// const WS_ENDPOINT = environment.wsEndpoint;
const WS_ENDPOINT = 'ws://localhost:8081';

interface WebSocketMessage<T> {
  type: string;
  message: T;
}

@Injectable({
  providedIn: 'root',
})
export class WsService<T> {
  private socket$: WebSocketSubject<WebSocketMessage<T>>;
  private messageSubject$ = new Subject<WebSocketMessage<T>>();
  private reconnectTries = 5;

  private message$: Observable<
    WebSocketMessage<T>
  > = this.messageSubject$.asObservable();

  constructor() {
    this.connect();
  }

  connect(): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewWebSocket();
      this.socket$
        .pipe(
          this.reconnect,
          tap({ error: (error) => console.log(error) }),
          catchError((_) => EMPTY)
        )
        .subscribe(this.messageSubject$);
    }
  }

  sendMessage(type: string, message: T): void {
    const body: WebSocketMessage<T> = {
      type,
      message,
    };
    this.socket$.next(body);
  }

  messageReceiver(type: string): Observable<T> {
    return this.message$.pipe(
      filter((msg) => msg.type === type),
      map((msg) => msg.message)
    );
  }

  close(): void {
    this.socket$.complete();
  }

  private getNewWebSocket(): WebSocketSubject<WebSocketMessage<T>> {
    return webSocket({ url: WS_ENDPOINT });
  }

  private reconnect(
    observable: WebSocketSubject<WebSocketMessage<T>>
  ): Observable<any> {
    return observable.pipe(
      retryWhen((errors) =>
        errors.pipe(
          tap((val) => {
            console.log(`try to reconnect`, val);
          }),
          delayWhen((_) => timer(500))
        )
      )
    );
  }
}
