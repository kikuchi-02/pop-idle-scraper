import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WebsocketProvider } from 'y-websocket';
import { Doc } from 'yjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public ydoc = new Doc();
  public wsProvider: WebsocketProvider;

  constructor() {
    this.wsProvider = new WebsocketProvider(
      `${environment.production ? 'wss' : 'ws'}://${window.location.host}`,
      '__text',
      this.ydoc
    );
  }

  wsSynced(): Observable<void> {
    return new Observable((subscriber: Subscriber<void>) => {
      if (this.wsProvider.synced) {
        subscriber.next();
        subscriber.complete();
      } else {
        this.wsProvider.once('wsSynced', (isSynced: boolean) => {
          if (isSynced) {
            subscriber.next();
            subscriber.complete();
          }
        });
      }
    });
  }
}
