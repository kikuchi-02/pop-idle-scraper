import { Injectable } from '@angular/core';
import { interval, Observable } from 'rxjs';
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

  constructor() {
    this.wsProvider = new WebsocketProvider(
      `${environment.production ? 'wss' : 'ws'}://${window.location.host}`,
      '__text',
      this.ydoc
    );
  }

  wsSynced(): Observable<void> {
    return interval(300).pipe(
      filter(() => this.wsProvider.synced),
      map(() => void 0),
      first()
    );
  }
}
