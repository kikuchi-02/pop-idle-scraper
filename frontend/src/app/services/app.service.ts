import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  interval,
  Observable,
  Subscriber,
  throwError,
} from 'rxjs';
import { filter, first, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { WebsocketProvider } from 'y-websocket';
import { Doc } from 'yjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public ydoc = new Doc();
  public wsProvider: WebsocketProvider;

  private darkThemeSubject$ = new BehaviorSubject<boolean>(false);
  public darkTheme$ = this.darkThemeSubject$.asObservable();

  get useWs(): boolean {
    return environment.USE_WS;
  }

  constructor() {
    if (this.useWs) {
      this.wsProvider = new WebsocketProvider(
        `${environment.production ? 'wss' : 'ws'}://${window.location.host}`,
        '__text',
        this.ydoc
      );
    }
  }

  wsSynced(): Observable<void> {
    if (!this.useWs) {
      return throwError('ws is off');
    }
    // return new Observable((subscriber: Subscriber<void>) => {
    //   if (this.wsProvider.synced) {
    //     subscriber.next();
    //     subscriber.complete();
    //   } else {
    //     this.wsProvider.once('wsSynced', (isSynced: boolean) => {
    //       if (isSynced) {
    //         subscriber.next();
    //         subscriber.complete();
    //       }
    //     });
    //   }
    // });
    return new Observable((subscriber: Subscriber<void>) => {
      if (this.wsProvider.synced) {
        subscriber.next();
        subscriber.complete();
      } else {
        interval(100)
          .pipe(
            filter(() => this.wsProvider.synced),
            map(() => void 0),
            first()
          )
          .subscribe(subscriber);
      }
    });
  }

  setTheme(darkTheme: boolean): void {
    this.darkThemeSubject$.next(darkTheme);
  }
}
