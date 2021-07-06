import { Injectable } from '@angular/core';
import { EMPTY, Observable, Subject, timer } from 'rxjs';
import { catchError, delayWhen, retryWhen, tap } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
// import { environment } from 'src/environments/environment';

// const WS_ENDPOINT = environment.wsEndpoint;
const WS_ENDPOINT = 'ws://localhost:8081';

@Injectable({
  providedIn: 'root',
})
export class WsService<T> {
  private socket$: WebSocketSubject<any>;
  private messageSubject$ = new Subject<T>();

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public message$: Observable<T> = this.messageSubject$.asObservable();

  constructor() {}

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

  sendMessage(msg: T) {
    this.socket$.next(msg);
  }
  close() {
    this.socket$.complete();
  }

  private getNewWebSocket() {
    return webSocket({ url: WS_ENDPOINT });
  }

  private reconnect(observable: Observable<any>): Observable<any> {
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
